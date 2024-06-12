import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate } from 'uuid';

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

  findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;


    try {
      return this.productRepository.find({
        take: limit,
        skip: offset,
      });

    } catch (error) {
      this.logger.error({ error: error.message, detail: error.detail });
      throw new InternalServerErrorException({ message: error.message, detail: error.detail });


    }



  }

  async findOne(term: string) {
    let product: Product;



    try {
      if (validate(term)) {
        product = await this.productRepository.findOne({ where: { id: term } });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('UPPER(title) =:title or slug =:slug', { title: term.toUpperCase(), slug: term.toLowerCase() }).getOne();

      }

      if (!product) {

        throw new BadRequestException('Product not found');
      }

      return product;
    } catch (error) {

      this.logger.error({ error: error.message, detail: error.detail });
      throw new InternalServerErrorException({ message: error.message, detail: error.detail });

    }



  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {

      const product =  await this.productRepository.preload({
        id,
        ...updateProductDto,
      })

      if (!product) {

        throw new NotFoundException(`Product with id ${id} not found`);
      }

      await this.productRepository.save(product);

      return product;



    } catch (error) {
      this.logger.error({ error: error.message, detail: error.detail });

      throw new InternalServerErrorException({ message: error.message, detail: error.detail });
    }

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
