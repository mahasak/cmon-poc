import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();
export interface Context {
    prisma: PrismaClient;
}

const prisma = new PrismaClient();
export const getPrismaClient = async (): Promise<Context> => ({ prisma });

export const getPrisma = async () => {
    const { prisma } = await getPrismaClient();
    return prisma;
}
