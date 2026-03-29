import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Product } from './entities/product.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(body: CreateProductDto): Promise<Product>;
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
