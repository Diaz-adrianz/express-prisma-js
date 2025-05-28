import BaseController from '../../base/controller.base.js';
import { NotFound } from '../../middlewares/exception.middleware.js';
import RoleService from './role.service.js';

class RoleController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new RoleService();
  }

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'Role list retrieved');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound('Role not found');

    return this.success(res, data, 'Role retrieved');
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, 'Role created');
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, 'Role updated');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'Role deleted');
  });
}

export default RoleController;
