import { NotificationsService } from '../notifications/notifications.service';
declare class TestNotificationDto {
    token: string;
}
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    testFirebase(testDto: TestNotificationDto): Promise<{
        message: string;
        firebaseResponse: string;
        error?: undefined;
    } | {
        message: string;
        error: string;
        firebaseResponse?: undefined;
    }>;
}
export {};
