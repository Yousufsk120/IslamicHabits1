// Use mock client when Prisma client is not available
export const prisma = (() => {
  try {
    // Try to import the real Prisma client
    const { PrismaClient } = require('@prisma/client');
    const client = new PrismaClient({
      log: ['query'],
    });
    return client;
  } catch (error) {
    console.warn('Prisma client not available, using mock client');
    // Import the mock client
    return require('./prisma-mock').prisma;
  }
})();

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).prisma = prisma;
}