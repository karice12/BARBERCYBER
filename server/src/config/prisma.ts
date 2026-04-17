import { PrismaClient } from '../../generated/prisma';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const dbUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('Nenhuma URL de banco de dados configurada (SUPABASE_DATABASE_URL ou DATABASE_URL).');
}

const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    accelerateUrl: dbUrl,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
