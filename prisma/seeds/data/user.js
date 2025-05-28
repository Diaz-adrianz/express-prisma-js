import bcrypt from 'bcrypt';
import { Prisma, PrismaClient } from '../../generated/client/index.js';

const saltPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

/**
 * @type {Prisma.UserCreateManyInput[]}
 */
const userList = [
  {
    id: 'b6f62ca5-14cd-4577-8e39-6ade56f9b405',
    username: 'superadmin',
    email: 'superadmin@example.com',
    password: process.env.SDM_PASSWORD,
    isActive: true,
  },
  {
    id: 'df477f32-62ce-4c1a-82ea-34a8c831a1db',
    username: 'admin',
    email: 'admin@example.com',
    password: process.env.ADM_PASSWORD,
    isActive: true,
  },
  {
    id: 'bbab31e4-eca6-4e70-bcf3-164cbe7b0fa5',
    username: 'user',
    email: 'user@example.com',
    password: process.env.USR_PASSWORD,
    isActive: true,
  },
];

/**
 * @param {PrismaClient} prisma
 */
async function seedUser(prisma) {
  try {
    const data = await Promise.all(
      userList.map(async (dat) => ({
        ...dat,
        password: await saltPassword(dat.password),
      }))
    );

    const result = await prisma.user.createMany({
      data: data,
      skipDuplicates: true,
    });

    console.log(
      `✅ User seeder ${userList.length} data ${result.count} inserted`
    );
  } catch (error) {
    console.error('❌', error);
  }
}

export default seedUser;
