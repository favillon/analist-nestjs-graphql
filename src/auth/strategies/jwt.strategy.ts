import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { Repository } from "typeorm";

import { User } from "../../users/entities/user.entity";
import { JwtPayload } from '../interfaces/jwt-payload.interfaces';

@Injectable()
export class JwtStrategy  extends PassportStrategy(Strategy, 'jwt') {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        configService:ConfigService
    ) {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the configuration');
        }
        super({
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload:JwtPayload): Promise<User> {

        const { id } = payload;
        const user = await this.userRepository.findOne({where: {id}});
        if (!user) {
            throw new UnauthorizedException('Token not valid');
        }
        if (!user.isActive) {
            throw new UnauthorizedException('User is inactive');
        }
        delete (user as Partial<User>).password;
        return user;
    }
}