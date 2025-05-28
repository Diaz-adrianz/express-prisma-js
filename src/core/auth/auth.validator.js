import Joi from 'joi';

export const AuthValidator = {
  register: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(16).required(),
    password: Joi.string().min(6).max(16).required(),
    matchPassword: Joi.string().valid(Joi.ref('password')).required(),
  }),
  sendActivationToken: Joi.object({
    email: Joi.string().email().required(),
  }),
  activateByToken: Joi.object({
    token: Joi.string().required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(16).required(),
  }),
  refreshToken: Joi.object({
    refresh: Joi.string().required(),
  }),
};

export default AuthValidator;
