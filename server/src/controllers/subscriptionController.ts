import { Response } from 'express';
import stripe from '../config/stripe';
import prisma from '../config/prisma';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const PRICE_IDS: Record<string, string> = {
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE ?? '',
  PLUS5: process.env.STRIPE_PRICE_PLUS5 ?? '',
};

export async function createCheckoutSession(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const userId = req.userId!;
  const { plan } = req.body as { plan: 'ENTERPRISE' | 'PLUS5' };

  if (!plan || !PRICE_IDS[plan]) {
    res.status(400).json({ error: 'Plano inválido ou price ID não configurado.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) { res.status(404).json({ error: 'Usuário não encontrado.' }); return; }

    // Cria ou reutiliza o customer no Stripe
    let customerId = user.stripeCustomerId ?? undefined;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
    }

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5000';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      metadata: { userId, plan },
      success_url: `${frontendUrl}/dashboard/subscription?success=1`,
      cancel_url: `${frontendUrl}/dashboard/subscription?cancelled=1`,
    });

    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? 'Erro ao criar sessão de checkout.' });
  }
}

export async function cancelSubscription(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  const userId = req.userId!;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.stripeSubscriptionId) {
      res.status(400).json({ error: 'Nenhuma assinatura ativa encontrada.' });
      return;
    }

    await stripe.subscriptions.cancel(user.stripeSubscriptionId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        planType: 'ESSENTIAL',
        hasPlus5Addon: false,
        stripeSubscriptionId: null,
      },
    });

    res.json({ message: 'Assinatura cancelada com sucesso.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? 'Erro ao cancelar assinatura.' });
  }
}
