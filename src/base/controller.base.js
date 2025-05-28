import httpStatus from 'http-status';
import fs from 'fs';
import { exception } from '../middlewares/exception.middleware.js';

class BaseController {
  constructor() {}

  wrapper(method) {
    return async (req, res, ...args) => {
      try {
        return await method.apply(this, [req, res, ...args]);
      } catch (err) {
        exception(err, req, res);
      }
    };
  }

  success = (res, data = null, message = '') => {
    return res.status(httpStatus.OK).json({
      status: true,
      message: message || 'Success',
      data,
    });
  };

  created = (res, data = null, message = '') => {
    return res.status(httpStatus.CREATED).json({
      status: true,
      message: message || 'Data created',
      data,
    });
  };

  noContent = (res, message = '') => {
    return res.status(httpStatus.NO_CONTENT).json({
      status: true,
      message: message || 'Data deleted',
    });
  };

  joinFindAllQuery = (query, field, colval) => {
    query[field] = query[field] ? `${query[field]}+${colval}` : colval;
    return query;
  };
}

export default BaseController;
