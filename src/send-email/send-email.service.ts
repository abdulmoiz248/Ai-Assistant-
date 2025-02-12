import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SendEmailService {
  private transporter1 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  private transporter2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER1,
        pass: process.env.EMAIL_PASS1,
    },
  });

  async sendEmailFrom1(prompt: string) {
    const { to, subject, body } = this.extractEmailData(prompt);
    await this.transporter1.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: body,
    });
    console.log('Email sent from account 1!');
  }

  async sendEmailFrom2(prompt: string) {
    const { to, subject, body } = this.extractEmailData(prompt);
    await this.transporter2.sendMail({
      from: process.env.EMAIL_USER1,
      to,
      subject,
      text: body,
    });
    console.log('Email sent from account 2!');
  }

  private extractEmailData(prompt: string) {
    const lines = prompt.split('\n').map(line => line.trim()).filter(line => line);

    if (lines.length < 4 || !lines[0].startsWith('email-account')) {
      throw new Error('Invalid email prompt format.');
    }

    const to = lines[1];
    const subject = lines[2];
    const body = lines.slice(3).join('\n');

    return { to, subject, body };
  }
}
