import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { logger } from '../logger/index.js';
import { promises as fs } from 'fs';

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    });
  }

  renderView = async (fileName, payload = {}) => {
    try {
      const file = await fs.readFile(`src/views/${fileName}`, {
        encoding: 'utf-8',
      });
      const template = handlebars.compile(file);
      const rendered = template(payload);

      return rendered;
    } catch (error) {
      logger.error(error);
    }
  };

  sendMail = async ({
    from = `Diaz <${process.env.MAILER_USER}>`,
    to,
    subject,
    viewFile,
    viewPayload,
  }) => {
    const content = await this.renderView(viewFile, viewPayload);

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html: content,
      });
    } catch (error) {
      logger.error(error);
    }
  };
}

export default Mailer;
