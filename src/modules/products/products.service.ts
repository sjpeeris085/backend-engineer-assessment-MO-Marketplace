import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { createSlug } from './utils/helper';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createDto: CreateProductDto) {
    const slug = createSlug(createDto.name, createDto.model);

    const product = this.productRepo.create({
      ...createDto,
      slug: slug,
    });
    return this.productRepo.save(product);
  }

  async findAll(query: QueryProductDto) {
    const { page = 1, limit = 10 } = query;

    const [data, total] = await this.productRepo.findAndCount({
      where: { isActive: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id, isActive: true });
    if (!product)
      throw new NotFoundException(`Product with ID "${id}" not found`);
    return product;
  }

  async getBySlug(slug: string): Promise<Product> {
    const product = await this.productRepo.findOneBy({ slug, isActive: true });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }
}
