import fs from 'fs';
import path from 'path';
import { program } from 'commander';

program.option('--name <name>', 'Name of the folder to create');

program.parse(process.argv);

const options = program.opts();

if (!options.name) {
  console.error('--name are required');
  process.exit(1);
}

const name = options.name;
const nameL = name.toLowerCase();
const modelName = name.charAt(0).toLowerCase() + name.slice(1);
const basePath = path.join('./src/core', nameL);

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

const files = [
  {
    name: nameL + '.validator.js',
    content: `import Joi from "joi";

export const ${name}Validator = {
  create: Joi.object({
    // no-data
  }),
  update: Joi.object({
    // no-data
  }),
};

export default ${name}Validator;
`,
  },
  {
    name: nameL + '.router.js',
    content: `import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.js";
import ${name}Controller from "./${nameL}.controller.js";
import ${name}Validator from "./${nameL}.validator.js";
import { baseValidator } from "../../base/validator.base.js";

const r = Router(),
  validator = ${name}Validator,
  controller = new ${name}Controller();

r.get(
  "/find-all",
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get("/find-one/:id", controller.findById);

r.post(
  "/create",
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.put(
  "/update/:id",
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete("/delete/:id", controller.delete);

const ${nameL}Router = r;
export default ${nameL}Router;
`,
  },
  {
    name: nameL + '.controller.js',
    content: `import BaseController from "../../base/controller.base.js";
import ${name}Service from "./${nameL}.service.js";

class ${name}Controller extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new ${name}Service();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, "${name} list retrieved");
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    return this.success(res, data, "${name} retrieved");
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, "${name} created");
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, "${name} updated");
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "${name} deleted");
  });
}

export default ${name}Controller;
`,
  },
  {
    name: nameL + '.service.js',
    content: `import BaseService from "../../base/service.base.js";
import { prisma } from "../../db/prisma.js";

class ${name}Service extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = await this.db.${modelName}.findMany({ ...q });

    if (query.paginate) {
      const countData = await this.db.${modelName}.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.${modelName}.findUniqueOrThrow({ where: { id } });
    return data;
  };

  create = async (payload) => {
    const data = await this.db.${modelName}.create({ data: payload });
    return data;
  };

  update = async (id, payload) => {
    const data = await this.db.${modelName}.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id) => {
    const data = await this.db.${modelName}.delete({ where: { id } });
    return data;
  };
}

export default ${name}Service;  
`,
  },
];

console.log('=== Core Generator ===');

files.forEach((file) => {
  fs.writeFileSync(path.join(basePath, file.name), file.content);
  console.log(`🚩 Created file: ${path.join(basePath, file.name)}`);
});

console.log(`✅ Generator completed for ${modelName}`);
