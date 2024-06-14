import { Injectable } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/data';



@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  
  ) {}
  


  async runSeed() {
    
    await this.inserNewProducts();
    return 'Seed run successfully';
  }


  

  private async inserNewProducts() {



    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    for (const product of products) {
      await this.productsService.create(product);
    }

    return 'Products inserted successfully';

    
  }


}
