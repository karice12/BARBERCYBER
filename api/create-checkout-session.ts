import Stripe from 'stripe'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { PRODUCTS } from '../src/lib/products'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { productId, successUrl, cancelUrl } = req.body

    if (!productId) {
      return res.status(400).json({ error: 'productId é obrigatório' })
    }

    const product = PRODUCTS.find(p => p.id === productId)
    if (!product) {
      return res.status(404).json({ error: `Produto "${productId}" não encontrado` })
    }

    const origin = req.headers.origin || 'http://localhost:5000'
    const finalSuccessUrl = successUrl || `${origin}/dashboard/assinatura?success=true`
    const finalCancelUrl = cancelUrl || `${origin}/dashboard/assinatura?canceled=true`

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            ...(product.recurring && {
              recurring: {
                interval: product.recurring.interval
              }
            })
          },
          quantity: 1,
        },
      ],
      mode: product.recurring ? 'subscription' : 'payment',
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return res.status(200).json({ 
      clientSecret: session.client_secret,
      sessionId: session.id
    })
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    return res.status(500).json({ 
      error: 'Erro interno ao criar sessão de checkout',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
}
