"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("../notifications/notifications.service");
class TestNotificationDto {
    token;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'your-fcm-token-here',
        description: 'Real FCM token for delivery or dummy string for dry-run',
    }),
    __metadata("design:type", String)
], TestNotificationDto.prototype, "token", void 0);
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async testFirebase(testDto) {
        try {
            const response = await this.notificationsService.verifyNotification(testDto.token);
            return {
                message: 'Dry run successful. Firebase is configured correctly!',
                firebaseResponse: response,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                message: 'Dry run failed.',
                error: errorMessage,
            };
        }
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('test-notification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Dry-run test for Firebase connection' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Firebase credentials and token format are valid.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid Token or Firebase Configuration Error.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TestNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "testFirebase", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('notifications'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map