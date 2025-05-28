import { exception } from './exception.middleware.js';

/**
 * @param {{body?: any, query?: any}} schemas
 */
const validatorMiddleware = ({ body, query }) => {
  return async (req, res, next) => {
    const options = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      const bodyValue = body
        ? await body.validateAsync(req.body ?? {}, options)
        : req.body;

      const queryValue = query
        ? await query.validateAsync(req.query ?? {}, options)
        : req.query;

      req.vbody = bodyValue;
      req.vquery = queryValue;

      next();
    } catch (err) {
      return exception(err, req, res);
    }
  };
};

export default validatorMiddleware;
