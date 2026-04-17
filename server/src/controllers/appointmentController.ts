import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { updateAppointmentStatus } from '../services/appointmentService';
import prisma from '../config/prisma';
import { AppointmentStatus } from '../../generated/prisma';

export async function create(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { clientName, clientPhone, serviceName, price, scheduledAt, staffId } = req.body;

  if (!clientName || !clientPhone || !serviceName || price === undefined || !scheduledAt || !staffId) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    return;
  }

  try {
    const staffExists = await prisma.staff.findFirst({ where: { id: staffId, userId } });
    if (!staffExists) { res.status(404).json({ error: 'Barbeiro não encontrado.' }); return; }

    const appointment = await prisma.appointment.create({
      data: {
        clientName,
        clientPhone,
        serviceName,
        price: Number(price),
        scheduledAt: new Date(scheduledAt),
        staffId,
        userId,
      },
    });
    res.status(201).json(appointment);
  } catch {
    res.status(500).json({ error: 'Erro interno ao criar agendamento.' });
  }
}

export async function list(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { date, staffId } = req.query;

  const where: Record<string, any> = { userId };

  if (staffId) where.staffId = String(staffId);

  if (date) {
    const day = new Date(String(date));
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    where.scheduledAt = { gte: day, lt: next };
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where,
      include: { staff: { select: { id: true, name: true, specialty: true } } },
      orderBy: { scheduledAt: 'asc' },
    });
    res.json(appointments);
  } catch {
    res.status(500).json({ error: 'Erro interno ao listar agendamentos.' });
  }
}

export async function updateStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const id = String(req.params.id);
  const { status } = req.body;

  const validStatuses = Object.values(AppointmentStatus);
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: `Status inválido. Use: ${validStatuses.join(', ')}.` });
    return;
  }

  try {
    const appointment = await updateAppointmentStatus(id, status as AppointmentStatus, userId);
    res.json(appointment);
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = statusCode < 500 ? err.message : 'Erro interno ao atualizar agendamento.';
    res.status(statusCode).json({ error: message });
  }
}
