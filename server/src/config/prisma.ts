import { PrismaClient } from '../../generated/prisma';
import 'dotenv/config';

const dbUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

const prisma = new PrismaClient({
  accelerateUrl: dbUrl,
});

export default prisma;
