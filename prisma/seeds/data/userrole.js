import { Prisma, PrismaClient } from '../../generated/client/index.js';

/**
 * @type {Prisma.UserRoleCreateManyInput[]}
 */
const userRoleList = [
  {
    userId: 'b6f62ca5-14cd-4577-8e39-6ade56f9b405',
    roleId: '826f3133-2544-40d2-b4d4-1c18302a47a2',
  },
  {
    userId: 'b6f62ca5-14cd-4577-8e39-6ade56f9b405',
    roleId: 'a7b19d98-4159-4778-afc0-f006662eeb77',
  },
  {
    userId: 'df477f32-62ce-4c1a-82ea-34a8c831a1db',
    roleId: 'a7b19d98-4159-4778-afc0-f006662eeb77',
  },
  {
    userId: 'bbab31e4-eca6-4e70-bcf3-164cbe7b0fa5',
    roleId: 'b664d207-30d0-4717-a6af-7523dea941fc',
  },
];

/**
 * @param {PrismaClient} prisma
 */
async function seedUserRole(prisma) {
  try {
    const result = await prisma.userRole.createMany({
      data: userRoleList,
      skipDuplicates: true,
    });

    console.log(
      `✅ UserRole seeder ${userRoleList.length} data ${result.count} inserted`
    );
  } catch (error) {
    console.error('❌', error);
  }
}

export default seedUserRole;
