import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateMessageDto } from './dto/create.message';

@Injectable()
export class NotificationsService implements OnModuleInit {
  onModuleInit() {
    // Initialize Firebase once when the module starts
  }

  async sendPush(token: string, title: string, body: string) {
    const message = {
      notification: { title, body },
      token: token,
    };
    return admin.messaging().send(message);
  }

  async sendPushToMany(message: CreateMessageDto) {
    return admin
      .messaging()
      .sendEachForMulticast(message)
      .then((response) =>
        console.log('Sent notifications:', response.successCount),
      )
      .catch((err) => console.error(err));
  }
}
