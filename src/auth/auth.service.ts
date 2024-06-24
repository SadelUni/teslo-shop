import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/user.entity';
import * as bcrypt
  from "bcrypt";
import { CreateAuthDto, LoginAuthDto, UpdateAuthDto } from './dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private readonly jwtService: JwtService

  ) { }
  async create(createAuthDto: CreateAuthDto) {






    try {
      const auth = this.authRepository.create({
        ...createAuthDto,
        password: await bcrypt.hash(createAuthDto.password, 10),
      });


      const usernew = await this.authRepository.save(auth);
      delete usernew.password;
      return usernew;

    } catch (error) {
      return this.handleDBError(error);


    }
  }


  async login(loginCreateDto: LoginAuthDto) {

    try {
      const { email, password } = loginCreateDto;

      const user = await this.authRepository.findOne({
        where: { email },
        select: { password: true, email: true, id: true, role: true }
      });

      if (!user) {
        throw new UnauthorizedException("Mail does not exist");

      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);


      if (!isPasswordMatch) {
        throw new UnauthorizedException("Password is incorrect");

      }

      console.log(user.id);

      return {
        token: this.getJWTToken({ id: user.id }),
        user: user
      };


    } catch (error) {

      return this.handleDBError(error);

    }




  }

  async checkAuthStatus(user: Auth) {

    return {
      token: this.getJWTToken({ id: user.id }),
      user: user
    };

  }



  private getJWTToken(payload: JwtPayload) {

    const token = this.jwtService.sign(payload);

    return token;


  }


  private handleDBError(error: any): never {




    if (error.code === '23505') {

      throw new BadRequestException({
        error: error.message,
        code: error.code,
        detail: error.detail,
      });

    }

    throw new InternalServerErrorException({
      error: error.message,
      code: error.code,
      detail: error.detail,
    });
  }


}



