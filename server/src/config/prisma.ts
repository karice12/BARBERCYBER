import { PrismaClient } from '../../generated/prisma';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error('Variável de ambiente DATABASE_URL não configurada.');
}

const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
