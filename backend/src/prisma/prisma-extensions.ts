import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient().$extends({
    query: {
      user: {
        create({args, query}) {
            console.log(args);
          if (args && args.data['password']) {
            args.data['password'] = bcrypt.hashSync(args.data['password'], 10)
          }
          return query(args);
        },
        // udpate({args, query}) {
        //     if (args && args.data['password']) {
        //       args.data['password'] = bcrypt.hashSync(args.data['password'], 10)
        //     }
        //     return query(args);
        //   }
      }
    }
  })

export default prisma;