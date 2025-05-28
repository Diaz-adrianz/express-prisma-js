import { PrismaClient } from '../generated/client/index.js';
import seedUserRole from './data/userrole.js';
import seedUser from './data/user.js';
import seedRole from './data/role.js';

const prisma = new PrismaClient();

await seedRole(prisma);
await seedUser(prisma);
await seedUserRole(prisma);
