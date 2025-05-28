import BaseService from '../../base/service.base.js';
import { prisma } from '../../db/prisma.js';
import bcrypt from 'bcrypt';
import FileManager from '../../lib/file-manager/index.js';

class UserService extends BaseService {
  #fileManager;

  constructor() {
    super(prisma);
    this.#fileManager = new FileManager();
  }

  updatePicture = async (id, file) => {
    const user = await this.findById(id);
    const oldPic = user.picture;
    let newPic = null;

    if (file != null) {
      const filename = await this.#fileManager.putFile(
        'public',
        'user-pictures',
        file
      );
      newPic = filename;
    }

    const updateUser = await this.db.user.update({
      where: { id },
      data: { picture: newPic },
    });

    if (oldPic) await this.#fileManager.deleteFile(oldPic);

    return this.transformFields(updateUser, {
      password: () => undefined,
      picture: (v) => this.appendHost(v),
    });
  };

  findAll = async (query) => {
    const q = this.transformFindAllQuery(query);
    const data = (await this.db.user.findMany({ ...q })).map((dat) =>
      this.transformFields(dat, {
        password: () => undefined,
        picture: (v) => this.appendHost(v),
      })
    );

    if (query.paginate) {
      const countData = await this.db.user.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return this.noPaginate(data);
  };

  findById = async (id) => {
    const data = await this.db.user.findUniqueOrThrow({ where: { id } });
    return this.transformFields(data, {
      password: () => undefined,
      picture: (v) => this.appendHost(v),
    });
  };

  create = async (payload) => {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(payload.password, salt);
    const data = await this.db.user.create({
      data: { ...payload, password: hashPassword },
    });
    return this.transformFields(data, {
      password: () => undefined,
      picture: (v) => this.appendHost(v),
    });
  };

  update = async (id, payload) => {
    const data = await this.db.user.update({ where: { id }, data: payload });
    return this.transformFields(data, {
      password: () => undefined,
      picture: (v) => this.appendHost(v),
    });
  };

  delete = async (id) => {
    const data = await this.db.user.delete({ where: { id } });
    return this.transformFields(data, {
      password: () => undefined,
      picture: (v) => this.appendHost(v),
    });
  };
}

export default UserService;
