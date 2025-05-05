import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<{ token: string; user: { id: string; username: string; email: string } }> {
    // Перевірка на наявність користувача з таким email
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Перевірка на наявність користувача з таким username
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already in use');
    }

    if (existingUserByUsername) {
      throw new ConflictException('Username already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, username: user.username, email: user.email },
    }; // Повертаємо також інформацію про користувача
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { 
      token,
      user: { id: user.id, username: user.username, email: user.email } // Повертаємо інформацію про користувача
    };
  }
}
