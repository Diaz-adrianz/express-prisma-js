import fs from 'fs';
import path from 'path';
import { program } from 'commander';

program.option('--name <name>', 'Name of prisma model');

program.parse(process.argv);

const options = program.opts();

if (!options.name) {
  console.error(
    '--name are required. Name of prisma model in PascalCase or following schema casing'
  );
  process.exit(1);
}

const name = options.name;
const lowerName = name.toLowerCase();
const modelName = name.charAt(0).toLowerCase() + name.slice(1);

const seedPath = path.join('./prisma/seeds/data');
const seedsIndexPath = path.join('./prisma/seeds/index.js');

if (!fs.existsSync(seedPath)) {
  fs.mkdirSync(seedPath, { recursive: true });
}

const files = [
  {
    name: `${lowerName}.js`,
    content: `import { Prisma, PrismaClient } from '../../generated/client/index.js';

/**
 * @type {Prisma.${name}CreateManyInput[]}
 */
const ${modelName}List = [];

/**
 * @param {PrismaClient} prisma
 */
async function seed${name}(prisma) {
  try {
    const result = await prisma.${modelName}.createMany({
      data: ${modelName}List,
      skipDuplicates: true,
    });

    console.log(
      \`✅ ${name} seeder \${${modelName}List.length} data \${result.count} inserted\`
    );
  } catch (error) {
    console.error('❌', error);
  }
}

export default seed${name};
    `,
  },
];

function write() {
  console.log('=== Seed Generator ===');

  files.forEach((file) => {
    fs.writeFileSync(path.join(seedPath, file.name), file.content);
    console.log(`🚩 Created file: ${path.join(seedPath, file.name)}`);
  });

  try {
    const seedsIndexContent = fs.readFileSync(seedsIndexPath, 'utf-8');
    const newSeedsIndexContent = seedsIndexContent
      .replace(
        "import { PrismaClient } from '../generated/client/index.js';",
        `import { PrismaClient } from '../generated/client/index.js';\nimport seed${name} from './data/${lowerName}.js';`
      )
      .concat(`\nawait seed${name}(prisma);`);

    fs.writeFileSync(seedsIndexPath, newSeedsIndexContent);

    console.log(`🚩 Updated file: ${seedsIndexPath}`);
  } catch (error) {
    console.log('❌', error);
  }

  console.log(`✅ Generator completed for ${modelName}`);
}

write();
