import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MailService } from 'src/modules/mails/mails.service';

@Injectable()
export class UserCreatedEvent {
  constructor(private eventEmitter: EventEmitter2,private emailService:MailService) {}

  emitEvent() {
    this.eventEmitter.emit('user.created')
  }

  @OnEvent('user.created')
  listentToEvent(mailObject) {
    // this.emailService.sendTemplateMail(mailObject)
  }
}