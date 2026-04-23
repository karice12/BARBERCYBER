export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  recurring?: {
    interval: 'month' | 'year'
  }
}

// Catálogo de produtos/planos do BARBERCYBER
// IDs usados no checkout devem corresponder a estes
export const PRODUCTS: Product[] = [
  {
    id: 'cyber-essential',
    name: 'CYBER ESSENTIAL',
    description: 'O núcleo do seu negócio digital. Até 5 funcionários, agenda inteligente, finanças básicas e 3 relatórios por mês.',
    priceInCents: 6990, // R$ 69,90
    recurring: {
      interval: 'month'
    }
  },
  {
    id: 'addon-plus5',
    name: '+5 FUNCIONÁRIOS',
    description: 'Extensão para adicionar mais 5 slots de funcionários ao seu plano.',
    priceInCents: 2990, // R$ 29,90
    recurring: {
      interval: 'month'
    }
  },
  {
    id: 'cyber-enterprise',
    name: 'PLANO ENTERPRISE',
    description: 'Potência máxima ilimitada. Funcionários ilimitados, suporte prioritário, políticas de agendamento e relatórios ilimitados.',
    priceInCents: 14990, // R$ 149,90
    recurring: {
      interval: 'month'
    }
  }
]

export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find(p => p.id === productId)
}

export function formatPrice(priceInCents: number): string {
  return (priceInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
