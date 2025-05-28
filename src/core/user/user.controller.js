import BaseController from '../../base/controller.base.js';
import {
  BadRequest,
  NotFound,
} from '../../middlewares/exception.middleware.js';
import UserService from './user.service.js';

class UserController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new UserService();
  }

  me = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.user.id);
    return this.success(res, data);
  });

  updatePicture = this.wrapper(async (req, res) => {
    if (!req.file) throw new BadRequest('No picture provided');
    const data = await this.#service.updatePicture(req.user.id, req.file);
    return this.success(res, data);
  });

  removePicture = this.wrapper(async (req, res) => {
    const data = await this.#service.updatePicture(req.user.id, null);
    return this.success(res, data);
  });

  findAll = this.wrapper(async (req, res) => {
    const data = await this.#service.findAll(req.vquery);
    return this.success(res, data, 'User list retrieved');
  });

  findById = this.wrapper(async (req, res) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound('User not found');

    return this.success(res, data, 'User retrieved');
  });

  create = this.wrapper(async (req, res) => {
    const data = await this.#service.create(req.vbody);
    return this.created(res, data, 'User created');
  });

  update = this.wrapper(async (req, res) => {
    const data = await this.#service.update(req.params.id, req.vbody);
    return this.success(res, data, 'User updated');
  });

  delete = this.wrapper(async (req, res) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, 'User deleted');
  });
}

export default UserController;
