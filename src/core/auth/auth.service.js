import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';
import jwt from 'jsonwebtoken';
import {
  BadRequest,
  Forbidden,
  NotFound,
  Unauthenticated,
} from '../../middlewares/exception.middleware.js';
import bcrypt from 'bcrypt';
import Mailer from '../../lib/mailer/index.js';

class AuthService extends BaseService {
  constructor() {
    super(prisma);
    this.mailer = new Mailer();
  }

  register = async (payload) => {
    const sameEmail = await this.db.user.count({
      where: { email: payload.email },
    });
    if (sameEmail) throw new BadRequest('Email already registered');

    const sameUsername = await this.db.user.count({
      where: { username: payload.username },
    });
    if (sameUsername) throw new BadRequest('Username already taken');

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(payload.password, salt);

    const user = await this.db.user.create({
      data: {
        email: payload.email,
        username: payload.username,
        password: hashPassword,
        isActive: false,
        roles: {
          create: {
            role: {
              connect: {
                code: 'USR',
              },
            },
          },
        },
      },
    });
    await this.sendActivationToken({ email: user.email });

    return this.transformFields(user, {
      password: () => undefined,
      picture: (v) => this.appendHost(v),
    });
  };

  sendActivationToken = async ({ email }) => {
    const user = await this.db.user.findFirst({
      where: { email },
    });
    if (!user) throw new NotFound('Account not found');
    if (user.isActive) throw new NotFound('Account already activated');

    const expiresIn = +process.env.JWT_ACTIVATION_EXPIRED;
    const token = jwt.sign(
      { uid: user.id },
      process.env.JWT_ACTIVATION_SECRET,
      {
        expiresIn: expiresIn,
      }
    );

    await this.mailer.sendMail({
      to: email,
      subject: 'Account activation',
      viewFile: 'email-activation.html',
      viewPayload: {
        verifyPageURL: `${process.env.HOST_ACTIVATION_PAGE_URL}?token=${token}`,
        expiresIn: `${expiresIn / 60} minutes`,
      },
    });
  };

  activateByToken = async ({ token }) => {
    let data;
    try {
      data = jwt.verify(token, process.env.JWT_ACTIVATION_SECRET);
    } catch (err) {
      throw new Forbidden('Access has expired');
    }

    const res = await this.db.user.update({
      where: { id: data.uid },
      data: {
        isActive: true,
      },
    });

    if (!res) throw new NotFound('Account not found');
  };

  login = async (payload) => {
    const user = await this.db.user.findUnique({
      where: { email: payload.email },
      include: {
        roles: {
          select: {
            id: true,
            isActive: true,
            role: {
              select: {
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });
    if (!user) throw new NotFound('Account not found');

    if (!user.isActive) throw new Forbidden('Account suspended');

    const pwValid = await bcrypt.compare(payload.password, user.password);
    if (!pwValid) throw new BadRequest('Incorrect password');

    const activeRole = user.roles.find((ur) => ur.isActive);

    const [at, rt] = await this.generateToken(user.id, activeRole?.role?.code);

    return {
      user: this.transformFields(user, {
        password: () => undefined,
        picture: (v) => this.appendHost(v),
      }),
      tokens: { at, rt },
    };
  };

  refreshToken = async (body) => {
    const decoded = jwt.decode(body.refresh);

    try {
      jwt.verify(body.refresh, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      logger.error(e);
      throw new Unauthenticated();
    }

    const [at, rt] = await this.generateToken(decoded.uid, decoded.role);

    return { tokens: { at, rt } };
  };

  generateToken = (userId, roleCode = '') => {
    const payload = {
      uid: userId,
      roleCode: roleCode,
      iss: process.env.JWT_ISSUER,
    };

    return Promise.all([
      jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: +process.env.JWT_ACCESS_EXPIRED,
      }),
      jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: +process.env.JWT_REFRESH_EXPIRED,
      }),
    ]);
  };
}

export default AuthService;
