import { OnModuleInit } from '@nestjs/common';
export declare class NotificationsService implements OnModuleInit {
    onModuleInit(): void;
    sendPush(token: string, title: string, body: string): Promise<string>;
}
