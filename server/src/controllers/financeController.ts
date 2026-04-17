import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import prisma from '../config/prisma';

export async function summary(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({ error: 'Parâmetros startDate e endDate são obrigatórios (YYYY-MM-DD).' });
    return;
  }

  const start = new Date(String(startDate));
  const end = new Date(String(endDate));
  end.setDate(end.getDate() + 1);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400).json({ error: 'Datas inválidas.' });
    return;
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: start, lt: end } },
      select: { grossValue: true, commissionValue: true, netProfit: true },
    });

    const totals = transactions.reduce(
      (acc, t) => ({
        totalGross: acc.totalGross + t.grossValue,
        totalCommission: acc.totalCommission + t.commissionValue,
        totalNetProfit: acc.totalNetProfit + t.netProfit,
      }),
      { totalGross: 0, totalCommission: 0, totalNetProfit: 0 }
    );

    res.json({
      period: { startDate, endDate },
      totalAppointments: transactions.length,
      totalGross: parseFloat(totals.totalGross.toFixed(2)),
      totalCommission: parseFloat(totals.totalCommission.toFixed(2)),
      totalNetProfit: parseFloat(totals.totalNetProfit.toFixed(2)),
    });
  } catch {
    res.status(500).json({ error: 'Erro interno ao calcular resumo financeiro.' });
  }
}
