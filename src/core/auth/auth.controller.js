import BaseController from '../../base/controller.base.js';
import AuthService from './auth.service.js';

class AuthController extends BaseController {
  #service;

  constructor() {
    super();
    this.#service = new AuthService();
  }

  register = this.wrapper(async (req, res) => {
    const data = await this.#service.register(req.vbody);
    return this.success(
      res,
      data,
      'Check your email inbox to activate your account'
    );
  });

  sendActivationToken = this.wrapper(async (req, res) => {
    const data = await this.#service.sendActivationToken(req.vbody);
    return this.success(
      res,
      data,
      'Check your email inbox to activate your account'
    );
  });

  activateByToken = this.wrapper(async (req, res) => {
    const data = await this.#service.activateByToken(req.vbody);
    return this.success(res, data);
  });

  login = this.wrapper(async (req, res) => {
    const data = await this.#service.login(req.vbody);
    return this.success(res, data);
  });

  refreshToken = this.wrapper(async (req, res) => {
    const data = await this.#service.refreshToken(req.vbody);
    return this.success(res, data);
  });
}

export default AuthController;
