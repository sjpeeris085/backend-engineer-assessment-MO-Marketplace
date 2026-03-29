import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductsService {
    private readonly productRepo;
    constructor(productRepo: Repository<Product>);
    create(createDto: CreateProductDto): Promise<Product>;
    findAll(query: QueryProductDto): Promise<{
        data: Product[];
        meta: {
            total: number;
            page: number;
            lastPage: number;
        };
    }>;
    getById(id: string): Promise<Product>;
    getBySlug(slug: string): Promise<Product>;
}
