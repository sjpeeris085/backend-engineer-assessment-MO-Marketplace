import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsService],

  exports: [NotificationsService], // allows other modules to use it
})
export class NotificationsModule {}
