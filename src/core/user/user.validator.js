import Joi from 'joi';

export const UserValidator = {
  create: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isActive: Joi.bool().optional().default(true),
  }),
  update: Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    isActive: Joi.bool().optional(),
  }),
};

export default UserValidator;
