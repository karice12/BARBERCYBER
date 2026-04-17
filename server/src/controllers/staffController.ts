import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { createStaff } from '../services/staffService';
import prisma from '../config/prisma';

export async function create(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { name, specialty, commissionRate, isAvailable } = req.body;
  const userId = req.userId!;

  if (!name || !specialty || isAvailable === undefined) {
    res.status(400).json({ error: 'Nome, especialidade e disponibilidade são obrigatórios.' });
    return;
  }

  try {
    const staff = await createStaff({ name, specialty, commissionRate, isAvailable, userId });
    res.status(201).json(staff);
  } catch (err: any) {
    const status = err.statusCode || 500;
    const message = status < 500 ? err.message : 'Erro interno ao criar barbeiro.';
    res.status(status).json({ error: message });
  }
}

export async function list(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  try {
    const staff = await prisma.staff.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(staff);
  } catch {
    res.status(500).json({ error: 'Erro interno ao listar barbeiros.' });
  }
}

export async function getOne(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const id = String(req.params.id);
  try {
    const staff = await prisma.staff.findFirst({ where: { id, userId } });
    if (!staff) { res.status(404).json({ error: 'Barbeiro não encontrado.' }); return; }
    res.json(staff);
  } catch {
    res.status(500).json({ error: 'Erro interno.' });
  }
}

export async function update(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const id = String(req.params.id);
  const { name, specialty, commissionRate, isAvailable } = req.body;

  try {
    const existing = await prisma.staff.findFirst({ where: { id, userId } });
    if (!existing) { res.status(404).json({ error: 'Barbeiro não encontrado.' }); return; }

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(specialty !== undefined && { specialty }),
        ...(commissionRate !== undefined && { commissionRate }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
    });
    res.json(staff);
  } catch {
    res.status(500).json({ error: 'Erro interno ao atualizar barbeiro.' });
  }
}

export async function remove(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const id = String(req.params.id);

  try {
    const existing = await prisma.staff.findFirst({ where: { id, userId } });
    if (!existing) { res.status(404).json({ error: 'Barbeiro não encontrado.' }); return; }

    await prisma.staff.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erro interno ao deletar barbeiro.' });
  }
}
