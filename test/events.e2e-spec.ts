import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Events (e2e)', () => {
  let app;
  let eventId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an event', async () => {
    const response = await request(app.getHttpServer())
      .post('/events')
      .send({
        name: 'Sample Event',
        description: 'A sample event description',
        date: new Date().toISOString(),
        location: 'New York',
        maxParticipants: 100,
      })
      .expect(201);

    eventId = response.body.id;
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Sample Event');
  });

  it('should retrieve all events', async () => {
    const response = await request(app.getHttpServer())
      .get('/events')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // it('should limit event participants', async () => {
  //   const users = Array.from({ length: 10 }).map((_, i) => ({
  //     username: `user${i}`,
  //     email: `user${i}@example.com`,
  //     password: 'password',
  //   }));

  //   for (const user of users) {
  //     const userResponse = await request(app.getHttpServer())
  //       .post('/users/register')
  //       .send(user)
  //       .expect(201);

  //     const userId = userResponse.body.user.id;

  //     const response = await request(app.getHttpServer())
  //       .post(`/events/${eventId}/register`)
  //       .send({ userId });

  //     if (response.status === 400) {
  //       expect(response.body.message).toBe('Event capacity reached');
  //       break;
  //     }
  //   }
  // });
});
