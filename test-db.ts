import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

import prisma from './lib/prisma';

async function main() {
    console.log('Checking environment...');
    if (!process.env.DATABASE_URL) {
        console.error('ERROR: DATABASE_URL is missing from process.env');
        return;
    }
    console.log('DATABASE_URL found (length: ' + process.env.DATABASE_URL.length + ')');

    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connected successfully!');

        // Check if we can run a raw query (Postgres)
        const result = await prisma.$queryRaw`SELECT 1 as res`;
        console.log('Query result:', result);

    } catch (e) {
        console.error('Connection failed:');
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
