/**
 * Creates the initial root directory record that would be created 
 * when the server is first run
 */


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function directorySeed() {
    try {
        // Inserting a single user
        await prisma.directory.create({
            data: {
                directoryName: 'root',
                path: '~',
            },
        });

        console.log('Root Directory data seeded successfully!');
    } catch (error) {
        console.error('Error seeding root Directory data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

directorySeed();
