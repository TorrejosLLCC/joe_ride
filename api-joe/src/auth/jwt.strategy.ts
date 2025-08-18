import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const secretOrKey = configService.get<string>('JWT_SECRET');
        if (!secretOrKey) {
            throw new Error('JWT_SECRET is not configured');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey, // Now definitely a string
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}