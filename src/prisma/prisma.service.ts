import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client'; // <-- правильно!

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
  }
}
