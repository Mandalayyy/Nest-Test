import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { Participant, Event } from '../../generated/prisma/client';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) {}

  // Реєстрація учасника на подію
  async registerParticipant(userId: string, eventId: string): Promise<Participant> {
    const event: Event | null = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    const participantCount = await this.prisma.participant.count({
      where: { eventId },
    });

    if (participantCount >= event.maxParticipants) {
      throw new BadRequestException('Event has reached maximum participants');
    }

    return this.prisma.participant.create({
      data: {
        userId,
        eventId,
      },
    });
  }

  // Отримання всіх подій, на які зареєстрований користувач
  async getUserEvents(userId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
    });
  }
}
