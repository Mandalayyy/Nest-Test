import { Controller, Get, Post, Param, Body, Put, Delete, NotFoundException, ConflictException } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from '../../generated/prisma/client';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Отримання всіх подій
  @Get()
  async getAllEvents(): Promise<Event[]> {  // Заміна на тип Event
    return this.eventsService.getAllEvents();
  }

  // Отримання події за ID
  @Get(':id')
  async getEventById(@Param('id') id: string): Promise<Event | null> {  // Заміна на тип Event
    return this.eventsService.getEventById(id);
  }

  // Створення події
  @Post()
  async createEvent(@Body() data: { name: string; description: string; date: Date; location: string; maxParticipants: number }): Promise<Event> {  // Заміна на тип Event
    return this.eventsService.createEvent(data);
  }

  // Реєстрація учасника на подію
  @Post(':eventId/register')
  async registerParticipant(
    @Param('eventId') eventId: string,
    @Body('userId') userId: string,
  ): Promise<{ userId: string; eventId: string }> {
    return this.eventsService.registerParticipant(eventId, userId);
  }

  // Оновлення події
  @Put(':id')
  async updateEvent(@Param('id') id: string, @Body() data: { name?: string; description?: string; date?: Date; location?: string; maxParticipants?: number }): Promise<Event> {  // Заміна на тип Event
    return this.eventsService.updateEvent(id, data);
  }

  // Видалення події
  @Delete(':id')
  async deleteEvent(@Param('id') id: string): Promise<Event> {  // Заміна на тип Event
    return this.eventsService.deleteEvent(id);
  }
}
