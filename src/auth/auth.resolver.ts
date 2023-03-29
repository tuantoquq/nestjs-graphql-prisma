import { BadRequestException, Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserEntity } from 'src/models/user/user.model';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginResponse } from './auth.model';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guards/jwt.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthResolver.name);

  @Query(() => UserEntity, { name: 'User' })
  @UseGuards(JwtGuard)
  async profile(@GetUser() user: User) {
    try {
      return user;
    } catch (err) {
      return err;
    }
  }

  @Mutation(() => String)
  async register(@Args('data') data: RegisterDto) {
    try {
      // check exist username
      // const existUser = await this.prismaService.user.findFirst({
      //   where: {
      //     username: data.username,
      //   },
      // });
      // if (existUser) {
      //   throw new BadRequestException('Username is already used');
      // }

      const hashPassword = await this.authService.hashPassword(data.password);
      //create user
      await this.prismaService.user.create({
        data: {
          username: data.username,
          password: hashPassword,
        },
      });
      return 'Register Successfully!';
    } catch (err) {
      return err;
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Args('data') data: LoginDto): Promise<LoginResponse> {
    try {
      const existUser = await this.prismaService.user.findFirst({
        where: {
          username: data.username,
        },
      });
      if (!existUser) {
        throw new BadRequestException('Username is not exist!');
      }
      const check = await this.authService.comparePassword(
        data.password,
        existUser.password,
      );
      if (!check) {
        throw new BadRequestException('Invalid password');
      }
      const token = this.jwtService.sign({
        id: existUser.id,
      });
      this.logger.log(`User login ${existUser.username}. Token is ${token}`);
      return {
        accessToken: token,
      };
    } catch (err) {
      this.logger.error(`Error when login: ${err.message}`);
      return err;
    }
  }
}
