import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { createAutoSlug } from 'common/helpers';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {


    try {



      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product);
      return product;

    } catch (error) {
      this.logger.error({ error: error.message, detail: error.detail });
      throw new InternalServerErrorException({ message: error.message, detail: error.detail });
    }

  }

   findAll() {

    try {
      return  this.productRepository.find();
      
    } catch (error) {
      this.logger.error({ error: error.message, detail: error.detail });
      throw new InternalServerErrorException({ message: error.message, detail: error.detail });


    }



  }

  async findOne(term: string) {

    try {
      const product = await this.productRepository.findOne({ where: [{ id: term }, { slug: term }] });

      if (!product) {
        
        throw new BadRequestException('Product not found');
      }
  
      return product;
    } catch (error) {
      
      this.logger.error({ error: error.message, detail: error.detail });
      throw new InternalServerErrorException({ message: error.message, detail: error.detail });

    }

    

  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {

    try {

      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        
        throw new BadRequestException('Product not found');
      }

      await this.productRepository.remove(product);
      return product;
      
    } catch (error) {
      
      throw new InternalServerErrorException({ message: error.message, detail: error.detail });
    }


  }
}
