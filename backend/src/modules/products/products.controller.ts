import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Product } from './entities/product.entity';
@ApiTags('Products') // Group name in Swagger UI
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated product list' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ status: 200, description: 'Product list fetched' })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get a product by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the product' })
  @ApiResponse({
    status: 200,
    description: 'Product fetched successfully',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getById(@Param('id') id: string) {
    return this.productsService.getById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a product by its slug' })
  @ApiParam({ name: 'slug', description: 'Unique slug of the product' })
  @ApiResponse({
    status: 200,
    description: 'Product fetched successfully',
    type: Product,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  getBySlug(@Param('slug') slug: string) {
    return this.productsService.getBySlug(slug);
  }
}
