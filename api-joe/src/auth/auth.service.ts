import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
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

    async login(user: User) {
        return {

            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        };
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

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return this.usersService.create({
            ...userData,
            password: hashedPassword,
        });
    }
}