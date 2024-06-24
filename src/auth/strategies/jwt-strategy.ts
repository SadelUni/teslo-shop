import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { Auth } from '../entities/user.entity';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Auth)
        private readonly userRepository: Repository<Auth>,

        ConfigService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: ConfigService.get('JWT_SECRET')
        })

    }



    async validate(payload: JwtPayload): Promise<any> {

        const { id } = payload;


        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new UnauthorizedException("Mail does not exist");
        }

        if (!user.isActive) {
            throw new UnauthorizedException("User is not active");
        }

        console.log(user);

        return user







    }

}