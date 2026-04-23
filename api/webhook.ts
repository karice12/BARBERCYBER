import Stripe from 'stripe'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    if (!endpointSecret) {
      // Em desenvolvimento, aceita eventos sem verificação
      event = JSON.parse(buf.toString()) as Stripe.Event
    } else {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret)
    }
  } catch (err) {
    console.error('Erro na verificação do webhook:', err)
    return res.status(400).json({ error: 'Assinatura do webhook inválida' })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout completado:', session.id)
        
        // Atualiza o usuário com informações da assinatura
        if (session.customer_email) {
          const planType = session.metadata?.productId === 'cyber-enterprise' 
            ? 'ENTERPRISE' 
            : 'ESSENTIAL'
          
          const hasAddon = session.metadata?.productId === 'addon-plus5'

          await supabase
            .from('users')
            .update({ 
              plan_type: planType,
              has_plus5_addon: hasAddon || undefined,
              stripe_customer_id: session.customer as string
            })
            .eq('email', session.customer_email)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Assinatura criada/atualizada:', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Assinatura cancelada:', subscription.id)
        
        // Volta o usuário para o plano básico
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        if (customer && !customer.deleted && customer.email) {
          await supabase
            .from('users')
            .update({ 
              plan_type: 'ESSENTIAL',
              has_plus5_addon: false
            })
            .eq('email', customer.email)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Pagamento falhou:', invoice.id)
        break
      }

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return res.status(500).json({ error: 'Erro ao processar evento' })
  }
}
