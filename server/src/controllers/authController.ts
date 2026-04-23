import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não configurado.');
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'E-mail já cadastrado.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, planType: true, createdAt: true },
    });

    const token = generateToken(user.id);

    res.status(201).json({ user, token });
  } catch {
    res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        planType: user.planType,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch {
    res.status(500).json({ error: 'Erro interno ao realizar login.' });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        planType: true,
        hasPlus5Addon: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        createdAt: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    // Se quiser trocar a senha, valida a senha atual
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: 'Informe a senha atual para definir uma nova senha.' });
        return;
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        res.status(401).json({ error: 'Senha atual incorreta.' });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
        return;
      }
    }

    // Verifica se o novo e-mail já está em uso por outro usuário
    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        res.status(409).json({ error: 'E-mail já está em uso.' });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(newPassword && { password: await bcrypt.hash(newPassword, 10) }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        planType: true,
        hasPlus5Addon: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch {
    res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
  }
}

export async function getBusinessHours(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  try {
    const hours = await prisma.businessHours.findMany({
      where: { userId },
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(hours);
  } catch {
    res.status(500).json({ error: 'Erro interno ao buscar horários.' });
  }
}

export async function upsertBusinessHours(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.userId!;
  // Aceita um array de { dayOfWeek, openTime, closeTime, isOpen }
  const { hours } = req.body as {
    hours: { dayOfWeek: number; openTime: string; closeTime: string; isOpen: boolean }[];
  };

  if (!Array.isArray(hours) || hours.length === 0) {
    res.status(400).json({ error: 'Forneça um array "hours" com os horários.' });
    return;
  }

  try {
    const upserts = hours.map((h) =>
      prisma.businessHours.upsert({
        where: { userId_dayOfWeek: { userId, dayOfWeek: h.dayOfWeek } },
        create: { userId, dayOfWeek: h.dayOfWeek, openTime: h.openTime, closeTime: h.closeTime, isOpen: h.isOpen },
        update: { openTime: h.openTime, closeTime: h.closeTime, isOpen: h.isOpen },
      })
    );
    const result = await prisma.$transaction(upserts);
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Erro interno ao salvar horários.' });
  }
}
