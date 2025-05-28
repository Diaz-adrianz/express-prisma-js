import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import AuthController from './auth.controller.js';
import AuthValidator from './auth.validator.js';
import { baseValidator } from '../../base/validator.base.js';

const r = Router(),
  validator = AuthValidator,
  controller = new AuthController();

r.post(
  '/register',
  validatorMiddleware({ body: validator.register }),
  controller.register
);

r.post(
  '/send-activation-token',
  validatorMiddleware({ body: validator.sendActivationToken }),
  controller.sendActivationToken
);

r.post(
  '/activate-by-token',
  validatorMiddleware({ body: validator.activateByToken }),
  controller.activateByToken
);

r.post(
  '/login',
  validatorMiddleware({ body: validator.login }),
  controller.login
);

r.post(
  '/refresh-token',
  validatorMiddleware({ body: validator.refreshToken }),
  controller.refreshToken
);

const authRouter = r;
export default authRouter;
