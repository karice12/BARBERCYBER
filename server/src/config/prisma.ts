import { PrismaClient } from '../../generated/prisma';
import 'dotenv/config';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

export default prisma;
