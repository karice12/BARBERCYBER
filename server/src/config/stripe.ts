// eslint-disable-next-line @typescript-eslint/no-require-imports
const Stripe = require('stripe');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Variável de ambiente STRIPE_SECRET_KEY não configurada.');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe: any = new Stripe(stripeSecretKey);

export default stripe;
