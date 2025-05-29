import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

class FileManager {
  constructor() {}

  makeDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  generateFilename(originalname) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    return `${uniqueSuffix}-${originalname}`;
  }

  /**
   * @param {'uploads' | 'public'} dir
   * @param {string} bucket
   * @param {Express.Multer.File} file
   */
  async putFile(dir, bucket, file) {
    this.makeDir(`${dir}/${bucket}`);
    const filename = this.generateFilename(file.originalname);
    const filepath = path.join(dir, bucket, filename);
    await writeFile(filepath, file.buffer);
    return filepath;
  }

  /**
   * @param {'uploads' | 'public'} dir
   * @param {string} bucket
   * @param {Express.Multer.File[]} files
   */
  async putFiles(dir, bucket, files) {
    this.makeDir(`${dir}/${bucket}`);
    const filepaths = [];

    for (const file of files) {
      const filename = await this.putFile(dir, bucket, file);
      filepaths.push(filename);
    }

    return filepaths;
  }

  /**
   * @param {string} filepath
   */
  async deleteFile(filepath) {
    if (fs.existsSync(filepath)) {
      await unlink(filepath);
    }
  }

  /**
   * @param {string[]} filepaths
   */
  async deleteFiles(filepaths) {
    const deletions = filepaths.map((filepath) => this.deleteFile(filepath));
    await Promise.all(deletions);
  }
}

export default FileManager;
