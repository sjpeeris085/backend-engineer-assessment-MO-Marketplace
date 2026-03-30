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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let OrderService = class OrderService {
    dataSource;
    notificationsService;
    orderRepo;
    productRepo;
    constructor(dataSource, notificationsService, orderRepo, productRepo) {
        this.dataSource = dataSource;
        this.notificationsService = notificationsService;
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }
    async create(dto, idempotencyKey) {
        if (!idempotencyKey) {
            throw new common_1.BadRequestException('Idempotency-Key header is required');
        }
        const existing = await this.orderRepo.findOne({
            where: { idempotencyKey },
            relations: ['items'],
        });
        if (existing) {
            return existing;
        }
        return this.dataSource.transaction(async (manager) => {
            const productIds = dto.items.map((i) => i.productId);
            const products = await manager.findBy(product_entity_1.Product, {
                id: (0, typeorm_2.In)(productIds),
                isActive: true,
            });
            if (products.length !== productIds.length) {
                throw new common_1.BadRequestException('Some products are invalid');
            }
            const productMap = new Map(products.map((p) => [p.id, p]));
            let totalAmount = 0;
            const order = manager.create(order_entity_1.Order, {
                idempotencyKey,
                items: [],
            });
            for (const item of dto.items) {
                const product = productMap.get(item.productId);
                if (!product) {
                    throw new common_1.BadRequestException(`Product not found: ${item.productId}`);
                }
                const subTotal = Number(product.price) * item.quantity;
                const orderItem = manager.create(order_item_entity_1.OrderItem, {
                    productId: product.id,
                    quantity: item.quantity,
                    price: Number(product.price),
                    subTotal,
                });
                totalAmount += subTotal;
                order.items.push(orderItem);
            }
            order.totalAmount = totalAmount;
            const userToken = 'test-token-12345';
            try {
                const orderResult = await manager.save(order);
                await this.notificationsService.sendPush(userToken, 'Order Confirmed', `Your HeladivaTech order #${order.id} is being processed.`);
                return orderResult;
            }
            catch (err) {
                if (err.code === '23505') {
                    throw new common_1.ConflictException('Duplicate order (idempotency)');
                }
                throw err;
            }
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        notifications_service_1.NotificationsService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=orders.service.js.map