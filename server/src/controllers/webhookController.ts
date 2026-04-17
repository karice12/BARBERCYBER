import { Request, Response } from 'express';
import stripe from '../config/stripe';
import prisma from '../config/prisma';

export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    res.status(400).json({ error: 'Assinatura ou secret do webhook ausente.' });
    return;
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    res.status(400).json({ error: `Webhook inválido: ${err.message}` });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              planType: plan === 'ENTERPRISE' ? 'ENTERPRISE' : 'ESSENTIAL',
              hasPlus5Addon: plan === 'PLUS5',
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { planType: 'ESSENTIAL', hasPlus5Addon: false },
          });
        }
        break;
      }

      default:
        break;
    }

    res.json({ received: true, type: event.type });
  } catch {
    res.status(500).json({ error: 'Erro interno ao processar webhook.' });
  }
}
