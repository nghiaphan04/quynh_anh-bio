import { PrismaClient } from '@prisma/client';

// Prisma 5 no longer supports the `adapter` option. The client reads the
// DATABASE_URL environment variable automatically.
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
