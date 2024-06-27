// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10),
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string, attachments?:any[] ) {
    const mailOptions = {
      from: process.env.MAIL_REPLY_TO,
      to,
      subject,
      text,
      html,
      attachments
    };

    return   await this.transporter.sendMail(mailOptions);
  }

 

  async sendTemplateMail(to: string, subject: string, templateName: string, context: any, attachmentName?:any) {
   
    let attachments:any = []
    
    if(attachmentName){
      attachments = {
        path: this.getAttachmentPath(attachmentName),
        filename: attachmentName
      }
    }
    const file = 'dollar.png'
    const inlineAttachment = {
      filename: file,
      path:this.getAttachmentPath(file),
      cid: 'logo' // same as the cid in the template
    };

    attachments.push(inlineAttachment);
    
    const templatePath = this.getTemplatePath(templateName)
    const html = await this.compileTemplate(templatePath, context)
     return  await this.sendMail(to, subject, '', html, attachments)
  }

  private getTemplatePath(templateName: string): string {
    return join(__dirname, '..', '..','..', '..' ,'public', 'views', 'mail', 'templates', `${templateName}.hbs`);
  }

  private getAttachmentPath(fileName: string): string {
    return join(__dirname, '..', '..','..', '..' ,'public', 'images', 'mail-attachments', `${fileName}`);
    
  }

  private async compileTemplate(templatePath: string, context: any): Promise<string> {
    const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(context);
  }
}
