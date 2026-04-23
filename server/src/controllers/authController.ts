import { Response } from 'express';
import prisma from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

/**
 * GET /api/auth/me
 *
 * Retorna os dados do perfil do usuário autenticado.
 * O registro no banco é criado automaticamente pelo trigger do Supabase
 * (handle_new_user), então aqui apenas fazemos a leitura.
 */
export async function getMe(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const userId = req.userId!;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        planType: true,
        hasPlus5Addon: true,
        createdAt: true,
      },
    });

    if (!profile) {
      // Perfil ainda não criado pelo trigger — cria na primeira chamada
      const newProfile = await prisma.profile.create({
        data: {
          id: userId,
          name: req.userEmail ?? '',
        },
        select: {
          id: true,
          name: true,
          planType: true,
          hasPlus5Addon: true,
          createdAt: true,
        },
      });
      res.status(201).json({ profile: newProfile });
      return;
    }

    res.json({ profile });
  } catch (err) {
    console.error('[getMe] Erro:', err);
    res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
  }
}

/**
 * PATCH /api/auth/me
 *
 * Atualiza o nome do perfil do usuário autenticado.
 */
export async function updateMe(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const userId = req.userId!;
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'O campo "name" é obrigatório.' });
    return;
  }

  try {
    const profile = await prisma.profile.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        planType: true,
        hasPlus5Addon: true,
        createdAt: true,
      },
    });

    res.json({ profile });
  } catch (err) {
    console.error('[updateMe] Erro:', err);
    res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
  }
}
