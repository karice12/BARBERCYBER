import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';
import { PlanType } from '../../generated/prisma';

const ESSENTIAL_MONTHLY_LIMIT = 3;
const REPORT_ENDPOINT = 'daily';

export async function daily(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { date } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { planType: true },
    });

    if (!user) { res.status(404).json({ error: 'Usuário não encontrado.' }); return; }

    if (user.planType === PlanType.ESSENTIAL) {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const usageCount = await prisma.reportLog.count({
        where: {
          userId,
          endpoint: REPORT_ENDPOINT,
          createdAt: { gte: monthStart, lt: monthEnd },
        },
      });

      if (usageCount >= ESSENTIAL_MONTHLY_LIMIT) {
        res.status(403).json({
          error: `Limite de ${ESSENTIAL_MONTHLY_LIMIT} relatórios/mês atingido no plano ESSENTIAL. Faça upgrade para ENTERPRISE para acesso ilimitado.`,
          usageCount,
          limit: ESSENTIAL_MONTHLY_LIMIT,
        });
        return;
      }
    }

    await prisma.reportLog.create({
      data: { userId, endpoint: REPORT_ENDPOINT },
    });

    const targetDate = date ? new Date(String(date)) : new Date();
    const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const [appointments, transactions] = await Promise.all([
      prisma.appointment.findMany({
        where: { userId, scheduledAt: { gte: dayStart, lt: dayEnd } },
        include: { staff: { select: { id: true, name: true, specialty: true, commissionRate: true } } },
        orderBy: { scheduledAt: 'asc' },
      }),
      prisma.transaction.findMany({
        where: { userId, date: { gte: dayStart, lt: dayEnd } },
        select: { grossValue: true, commissionValue: true, netProfit: true },
      }),
    ]);

    const financialSummary = transactions.reduce(
      (acc, t) => ({
        totalGross: acc.totalGross + t.grossValue,
        totalCommission: acc.totalCommission + t.commissionValue,
        totalNetProfit: acc.totalNetProfit + t.netProfit,
      }),
      { totalGross: 0, totalCommission: 0, totalNetProfit: 0 }
    );

    res.json({
      reportDate: dayStart.toISOString().split('T')[0],
      generatedAt: new Date().toISOString(),
      appointments: {
        total: appointments.length,
        completed: appointments.filter(a => a.status === 'COMPLETED').length,
        pending: appointments.filter(a => a.status === 'PENDING').length,
        canceled: appointments.filter(a => a.status === 'CANCELED').length,
        noShow: appointments.filter(a => a.status === 'NO_SHOW').length,
        items: appointments,
      },
      financial: {
        totalGross: parseFloat(financialSummary.totalGross.toFixed(2)),
        totalCommission: parseFloat(financialSummary.totalCommission.toFixed(2)),
        totalNetProfit: parseFloat(financialSummary.totalNetProfit.toFixed(2)),
      },
    });
  } catch {
    res.status(500).json({ error: 'Erro interno ao gerar relatório.' });
  }
}
