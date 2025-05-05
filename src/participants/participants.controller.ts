import { Controller, Post, Param, Get } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { Participant } from '../../generated/prisma/client'

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  // Реєстрація учасника на подію
  @Post('register/:userId/:eventId')
  async registerParticipant(@Param('userId') userId: string, @Param('eventId') eventId: string): Promise<Participant> {
    return this.participantsService.registerParticipant(userId, eventId);
  }

  // Отримання подій, на які зареєстрований користувач
  @Get('user/:userId')
  async getUserEvents(@Param('userId') userId: string) {
    return this.participantsService.getUserEvents(userId);
  }
}
