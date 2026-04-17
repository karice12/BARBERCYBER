import prisma from '../config/prisma';
import { AppointmentStatus } from '../../generated/prisma';

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
  userId: string
) {
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, userId },
    include: { staff: { select: { commissionRate: true } } },
  });

  if (!appointment) {
    const err = new Error('Agendamento não encontrado.');
    (err as any).statusCode = 404;
    throw err;
  }

  if (status !== AppointmentStatus.COMPLETED) {
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  const grossValue = appointment.price;
  const commissionValue = grossValue * appointment.staff.commissionRate;
  const netProfit = grossValue - commissionValue;

  const [updatedAppointment] = await prisma.$transaction([
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.COMPLETED },
    }),
    prisma.transaction.create({
      data: {
        grossValue,
        commissionValue,
        netProfit,
        date: new Date(),
        appointmentId: appointment.id,
        userId,
      },
    }),
  ]);

  return updatedAppointment;
}
