import { Router } from 'express';
import validatorMiddleware from '../../middlewares/validator.middleware.js';
import UserController from './user.controller.js';
import UserValidator from './user.validator.js';
import { baseValidator } from '../../base/validator.base.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { mbToBytes } from '../../utils/number.js';

const r = Router(),
  validator = UserValidator,
  controller = new UserController();

r.get('/me', authMiddleware(), controller.me);

r.patch(
  '/update-picture',
  authMiddleware(),
  upload({
    maxBytes: mbToBytes(3),
    mimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
  }).single('picture'),
  controller.updatePicture
);

r.patch('/remove-picture', authMiddleware(), controller.removePicture);

r.get(
  '/find-all',
  authMiddleware(['SDM']),
  validatorMiddleware({ query: baseValidator.findAllQuery }),
  controller.findAll
);

r.get('/find-one/:id', authMiddleware(), controller.findById);

r.post(
  '/create',
  authMiddleware(['SDM']),
  validatorMiddleware({ body: validator.create }),
  controller.create
);

r.put(
  '/update/:id',
  authMiddleware(['SDM']),
  validatorMiddleware({ body: validator.update }),
  controller.update
);

r.delete('/delete/:id', authMiddleware(['SDM']), controller.delete);

const userRouter = r;
export default userRouter;
