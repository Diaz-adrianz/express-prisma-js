import { Prisma, PrismaClient } from '../../generated/client/index.js';

/**
 * @type {Prisma.RoleCreateManyInput[]}
 */
const roleList = [
  {
    id: '826f3133-2544-40d2-b4d4-1c18302a47a2',
    code: 'SDM',
    name: 'Superadmin',
  },
  {
    id: 'a7b19d98-4159-4778-afc0-f006662eeb77',
    code: 'ADM',
    name: 'Admin',
  },
  {
    id: 'b664d207-30d0-4717-a6af-7523dea941fc',
    code: 'USR',
    name: 'User',
  },
];

/**
 * @param {PrismaClient} prisma
 */
async function seedRole(prisma) {
  try {
    const result = await prisma.role.createMany({
      data: roleList,
      skipDuplicates: true,
    });

    console.log(
      `✅ Role seeder ${roleList.length} data ${result.count} inserted`
    );
  } catch (error) {
    console.error('❌', error);
  }
}

export default seedRole;
