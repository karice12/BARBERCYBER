import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Usar variável de ambiente configurada no vite.config.ts
const stripePublishableKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) ||
  ''

const stripePromise = loadStripe(stripePublishableKey)

interface StripeCheckoutProps {
  productId: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function StripeCheckout({ productId, isOpen, onClose, onSuccess }: StripeCheckoutProps) {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar sessão de checkout')
      }

      const { clientSecret } = await response.json()
      return clientSecret
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
      throw err
    }
  }, [productId])

  const handleComplete = useCallback(() => {
    onSuccess?.()
    onClose()
  }, [onSuccess, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight text-white">
            Finalizar Assinatura
          </DialogTitle>
        </DialogHeader>
        
        {error ? (
          <div className="p-6 text-center">
            <p className="text-red-500 font-bold mb-4">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-cyber-blue underline text-sm"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div id="checkout" className="min-h-[400px]">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ 
                fetchClientSecret,
                onComplete: handleComplete
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
