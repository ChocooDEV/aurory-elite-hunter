import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Modify connection URL to disable prepared statements
const getConnectionUrl = () => {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  
  // Add parameters to disable prepared statements
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}prepared_statements=false&connection_limit=1`;
};

// Create Prisma client with modified connection
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getConnectionUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 