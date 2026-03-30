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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const order_response_dto_1 = require("./dto/order-response.dto");
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    create(dto, idempotencyKey) {
        return this.orderService.create(dto, idempotencyKey);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order' }),
    (0, swagger_1.ApiBody)({ type: create_order_dto_1.CreateOrderDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Order created successfully',
        type: order_response_dto_1.OrderResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid request (e.g., invalid product)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Duplicate order (idempotency conflict)',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('Idempotency-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "create", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrderService])
], OrderController);
//# sourceMappingURL=orders.controller.js.map