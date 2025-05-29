import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import RoleController from './role.controller.js';
import RoleValidator from './role.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const r = Router(),
  validator = RoleValidator,
  controller = new RoleController();

r.get(
  '/find-all',
  authMiddleware(['SDM']),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', authMiddleware(['SDM']), controller.findById);

r.post(
  '/create',
  authMiddleware(['SDM']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.patch(
  '/update/:id',
  authMiddleware(['SDM']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete('/delete/:id', authMiddleware(['SDM']), controller.delete);

const roleRouter = r;
export default roleRouter;
