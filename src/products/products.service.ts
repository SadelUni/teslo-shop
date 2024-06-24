import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate } from 'uuid';
import { ProductImage } from './entities';
import { Auth } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,

    private readonly dataSources: DataSource
  ) { }

  async create(createProductDto: CreateProductDto, user: Auth) {


    try {


      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({ ...createProductDto, user, images: images.map(url => this.productImageRepository.create({ url })) });

      await this.productRepository.save(product);
      return { ...product, images };

    } catch (error) {
      this.logger.error({ error: error.message, detail: error.detail });
      throw new InternalServerErrorException({ message: error.message, detail: error.detail });
    }

  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;


    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });

      return products.map(products => ({
        ...products,
        images: products.images.map(image => ({ url: image.url, id: image.productId }))

      }))

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
          .where('UPPER(title) =:title or slug =:slug', { title: term.toUpperCase(), slug: term.toLowerCase() })
          .leftJoinAndSelect('product.images', 'images')
          .getOne();

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

  async update(id: string, updateProductDto: UpdateProductDto, user: Auth) {

    const { images, ...toUpdate } = updateProductDto;


    const product = await this.productRepository.preload({ id, ...toUpdate });
    product.user = user;

    if (!product) {

      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // create query runner

    const queryRunner = this.dataSources.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { productId: id });
        await queryRunner.manager.save(ProductImage, images.map(url => this.productImageRepository.create({ url, productId: id })));

        await queryRunner.manager.save(Product, product);
        await queryRunner.commitTransaction();
        await queryRunner.release();

        return { ...product, images };

      } else {

        await queryRunner.manager.save(Product, product);
        await queryRunner.commitTransaction();
        await queryRunner.release();

        return this.findOne(id);

      }




    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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


  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();

    } catch (error) {
      this.logger.error({ error: error.message, detail: error.detail });
      throw new InternalServerErrorException({ message: error.message, detail: error.detail });

    }
  }

}
