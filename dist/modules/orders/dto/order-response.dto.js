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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResponseDto = exports.OrderItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class OrderItemResponseDto {
    productId;
    quantity;
    price;
    subTotal;
}
exports.OrderItemResponseDto = OrderItemResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemResponseDto.prototype, "subTotal", void 0);
class OrderResponseDto {
    id;
    idempotencyKey;
    totalAmount;
    items;
    createdAt;
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OrderItemResponseDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=order-response.dto.js.map