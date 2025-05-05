import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Підключаємо Prisma

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  // Створення події
  async createEvent(data: { name: string; description: string; date: Date; location: string; maxParticipants: number }) {
    return this.prisma.event.create({
      data,
    });
  }

  // Оновлення події
  async updateEvent(id: string, data: { name?: string; description?: string; date?: Date; location?: string; maxParticipants?: number }) {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  // Видалення події
  async deleteEvent(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }

  // Отримання всіх подій
  async getAllEvents() {
    return this.prisma.event.findMany();
  }

  // Отримання події за ID
  async getEventById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }

  // Реєстрація учасника на подію
  async registerParticipant(eventId: string, userId: string): Promise<{ userId: string; eventId: string }> {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const participantCount = await this.prisma.participant.count({
      where: { eventId },
    });

    if (participantCount >= event.maxParticipants) {
      throw new ConflictException('Event capacity reached');
    }

    const existingParticipant = await this.prisma.participant.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existingParticipant) {
      throw new ConflictException('User is already registered for this event');
    }

    await this.prisma.participant.create({
      data: {
        event: { connect: { id: eventId } },
        user: { connect: { id: userId } },
      },
    });

    return { userId, eventId };
  }
}
