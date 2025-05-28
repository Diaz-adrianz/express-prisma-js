import jwt from 'jsonwebtoken';
import {
  exception,
  Forbidden,
  Unauthenticated,
} from './exception.middleware.js';
import { prisma } from '../db/prisma.js';

/**
 * @param {("SDM" | "ADM" | "USR")[] | null} roleCodes
 */
const authMiddleware = (roleCodes = null) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new Unauthenticated();
      }

      let data;
      try {
        data = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      } catch (err) {
        throw new Unauthenticated();
      }

      // TODO: replace with redis
      const user = await prisma.user.findUnique({
        where: { id: data.uid },
        select: {
          id: true,
          isActive: true,
          roles: {
            select: {
              id: true,
              isActive: true,
              role: {
                select: { code: true },
              },
            },
          },
        },
      });
      if (!user) throw new Unauthenticated();
      if (!user.isActive) throw new Unauthenticated('Account suspended');

      const activeRole = user.roles.find((ur) => ur.isActive);

      if (roleCodes && !roleCodes.includes(activeRole.role.code)) {
        throw new Forbidden();
      }

      req.user = {
        id: user.id,
        roleCode: activeRole?.role?.code ?? null,
      };

      next();
    } catch (error) {
      exception(error, req, res);
    }
  };
};

export { authMiddleware };
