import prisma from '../config/prisma';
import { PlanType } from '../../generated/prisma';

interface CreateStaffData {
  name: string;
  specialty: string;
  commissionRate?: number;
  isAvailable: boolean;
  userId: string;
}

function getStaffLimit(planType: PlanType, hasPlus5Addon: boolean): number | null {
  if (planType === PlanType.ENTERPRISE) return null;
  if (planType === PlanType.ESSENTIAL && hasPlus5Addon) return 10;
  return 5;
}

export async function createStaff(data: CreateStaffData) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { planType: true, hasPlus5Addon: true },
  });

  if (!user) {
    const err = new Error('Usuário não encontrado.');
    (err as any).statusCode = 404;
    throw err;
  }

  const limit = getStaffLimit(user.planType, user.hasPlus5Addon);

  if (limit !== null) {
    const count = await prisma.staff.count({ where: { userId: data.userId } });
    if (count >= limit) {
      const err = new Error(
        `Limite de ${limit} barbeiro(s) atingido para o plano ${user.planType}${user.hasPlus5Addon ? ' + addon' : ''}. Faça upgrade para adicionar mais.`
      );
      (err as any).statusCode = 403;
      throw err;
    }
  }

  return prisma.staff.create({
    data: {
      name: data.name,
      specialty: data.specialty,
      commissionRate: data.commissionRate ?? 0.40,
      isAvailable: data.isAvailable,
      userId: data.userId,
    },
  });
}
