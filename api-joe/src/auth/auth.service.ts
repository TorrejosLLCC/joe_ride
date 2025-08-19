import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

function sanitizeUser(user: User) {
    if (!user) return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    // async login(user: User) {
    //     const payload = { email: user.email, sub: user.id };
    //     return {
    //         access_token: this.jwtService.sign(payload),
    //     };
    // }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken, user: sanitizeUser(user) };
    }

    //   fix > createtUserDto add set decorator password 
    //   async register(userData: Partial<User>): Promise<User> {
    //     const hashedPassword = await bcrypt.hash(userData.password, 10);
    //     return this.usersService.create({
    //       ...userData,
    //       password: hashedPassword,
    //     });
    //   }

    async register(userData: CreateUserDto): Promise<User> {
        if (!userData.password) {
            throw new BadRequestException('Password is required');
        }
        const existing = await this.usersService.findOneByEmail(userData.email);
        if (existing) {
            throw new ConflictException('Email already in use');
        }
        const rounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS') || '10', 10);
        const hashedPassword = await bcrypt.hash(userData.password, rounds);
        const created = await this.usersService.create({
            ...userData,
            password: hashedPassword,
        });
        return sanitizeUser(created) as unknown as User; // return sanitized
    }

    async me(userId: number): Promise<any> {
        const user = await this.usersService.findOneById(userId);
        return sanitizeUser(user as User);
    }
}