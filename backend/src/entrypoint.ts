import {PrismaClient} from "@prisma/client";
import {exec} from 'child_process';

import app from './server';
import {PORT} from './utils/config';

export const prisma = new PrismaClient();


async function waitForConnection(predicate: () => Promise<boolean>, options: any): Promise<void> {
    let retries = options.retries;
    while (retries > 0) {
        try {
            const result = await predicate();
            if (result) {
                return; // Connection established
            }
        } catch (error) {
            // Log any error if needed
            console.error('Error during connection check:', error);
        }

        // Wait for a specified delay before retrying
        await new Promise(resolve => setTimeout(resolve, options.delay));
        retries--;
    }

    // If retries exhausted, throw an error or handle it accordingly
    throw new Error('Connection could not be established within the specified retries.');
}

// Function to wait for the database to be ready
async function waitForDatabase() {
    const dbReady = async () => {
      try {
        await prisma.$connect();
        return true;
      } catch (error) {
        return false;
      }
    };
    await waitForConnection(dbReady, {
        retries: 10,
        delay: 5000, // 5 seconds delay between retries
        timeout: 30000, // 30 seconds timeout
      });
}


// Function to run Prisma commands
async function runPrismaCommands() {
    try {
        await waitForDatabase();
        // Run Prisma commands
        const command = "npx prisma migrate dev --name init"
        const command2 = "npx prisma migrate de";
        const command3 = "npx prisma db seed"
        exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running Prisma commands to init:', error);
        } else {
            console.log(stdout);
            console.error(stderr);
        }
        });
        exec(command2, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running Prisma commands to migrate', error);
            } else {
                console.log(stdout);
                console.error(stderr);
            }
        });
        exec(command3, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running Prisma seed', error);
            } else {
                console.log(stdout);
                console.error(stderr);
            }
        });

    } catch (error) {
      console.error('Error running Prisma commands:', error);
      process.exit(1);
    }
  }


  runPrismaCommands()
  .then(() => {
      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch(error => {
      console.error('Error starting server:', error);
      process.exit(1);
  });
