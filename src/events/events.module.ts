import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from '../prisma/prisma.module';
// Імпортуємо PrismaModule

@Module({
  imports: [PrismaModule], // Додаємо PrismaModule в imports
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
