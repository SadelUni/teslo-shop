import { Injectable } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/data';
import { Repository } from 'typeorm';
import { Auth } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';



@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly AuthService: AuthService

  ) { }



  async runSeed() {

    await this.deleteTables();
    const firstUser = await this.insertNewUsers();

    await this.inserNewProducts(firstUser);

    return { message: 'Seed executed successfully', firstUser };
  }


  private async deleteTables() {

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.authRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();




  }


  private async insertNewUsers() {

    const seedUsers = initialData.users;
    const users: Auth[] = [];


    seedUsers.forEach(user => {

      users.push(this.authRepository.create(user));
    })

    const dbUser = await this.authRepository.save(users);

    return dbUser[0];

  }




  private async inserNewProducts(firstUser: Auth) {



    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    for (const product of products) {
      await this.productsService.create(product, firstUser);
    }

    return 'Products inserted successfully';


  }


}
