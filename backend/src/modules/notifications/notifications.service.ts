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
    // Check if tokens array is empty
    if (!message.tokens || message.tokens.length === 0) {
      console.log('No FCM tokens to send notifications.');
      return { successCount: 0 };
    }

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log('Sent notifications:', response.successCount);
      return response;
    } catch (err) {
      console.error('FCM send error:', err);
      throw err;
    }
  }
}
