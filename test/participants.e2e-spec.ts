import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Participants (e2e)', () => {
  let app;

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

  it('should register a user for an event', async () => {
    // Створення події
    const eventResponse = await request(app.getHttpServer())
      .post('/events')
      .send({
        name: 'Sample Event',
        description: 'Description',
        date: new Date().toISOString(),
        location: 'NY',
        maxParticipants: 100,
      })
      .expect(201);

    const eventId = eventResponse.body.id;

    expect(eventResponse.body).toHaveProperty('id');
    expect(eventResponse.body.name).toBe('Sample Event');
    expect(eventResponse.body.maxParticipants).toBe(100);

    // Реєстрація користувача
    const userResponse = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: 'testuser3',
        email: 'testuser3@example.com',
        password: 'password',
      })
      .expect(201);

    const userId = userResponse.body.user.id;

    expect(userResponse.body).toHaveProperty('user');
    expect(userResponse.body.user.username).toBe('testuser3');
    expect(userResponse.body.user.email).toBe('testuser3@example.com');

    // Реєстрація учасника на подію
    const registerResponse = await request(app.getHttpServer())
      .post(`/events/${eventId}/register`)
      .send({ userId })
      .expect(201);

    expect(registerResponse.body).toHaveProperty('userId');
    expect(registerResponse.body.userId).toBe(userId);
    expect(registerResponse.body.eventId).toBe(eventId);
  });

  // it('should not allow duplicate registration for the same event', async () => {
  //   // Створення події
  //   const eventResponse = await request(app.getHttpServer())
  //     .post('/events')
  //     .send({
  //       name: 'Duplicate Event',
  //       description: 'Description',
  //       date: new Date().toISOString(),
  //       location: 'NY',
  //       maxParticipants: 100,
  //     })
  //     .expect(201);

  //   const eventId = eventResponse.body.id;

  //   // Реєстрація користувача
  //   const userResponse = await request(app.getHttpServer())
  //     .post('/users/register')
  //     .send({
  //       username: 'duplicateuser',
  //       email: 'duplicateuser@example.com',
  //       password: 'password',
  //     })
  //     .expect(201);

  //   const userId = userResponse.body.user.id;

  //   // Перша реєстрація на подію
  //   await request(app.getHttpServer())
  //     .post(`/events/${eventId}/register`)
  //     .send({ userId });
  //   // .expect(201);

  //   // Друга реєстрація на ту ж подію (очікується помилка)
  //   const duplicateRegisterResponse = await request(app.getHttpServer())
  //     .post(`/events/${eventId}/register`)
  //     .send({ userId })
  //     .expect(409);

  //   expect(duplicateRegisterResponse.body.message).toBe(
  //     'User is already registered for this event',
  //   );
  // });

  // it('should not allow registration if event capacity is reached', async () => {
  //   // Створення події з обмеженням на 1 учасника
  //   const eventResponse = await request(app.getHttpServer())
  //     .post('/events')
  //     .send({
  //       name: 'Limited Event',
  //       description: 'Description',
  //       date: new Date().toISOString(),
  //       location: 'NY',
  //       maxParticipants: 1,
  //     })
  //     .expect(201);

  //   const eventId = eventResponse.body.id;

  //   // Реєстрація першого користувача
  //   const firstUserResponse = await request(app.getHttpServer())
  //     .post('/users/register')
  //     .send({
  //       username: 'firstuser',
  //       email: 'firstuser@example.com',
  //       password: 'password',
  //     })
  //     .expect(201);

  //   const firstUserId = firstUserResponse.body.user.id;

  //   await request(app.getHttpServer())
  //     .post(`/events/${eventId}/register`)
  //     .send({ userId: firstUserId });
  //   // .expect(201);

  //   // Реєстрація другого користувача (очікується помилка)
  //   const secondUserResponse = await request(app.getHttpServer())
  //     .post('/users/register')
  //     .send({
  //       username: 'seconduser',
  //       email: 'seconduser@example.com',
  //       password: 'password',
  //     })
  //     .expect(201);

  //   const secondUserId = secondUserResponse.body.user.id;

  //   const capacityExceededResponse = await request(app.getHttpServer())
  //     .post(`/events/${eventId}/register`)
  //     .send({ userId: secondUserId })
  //     .expect(409);

  //   expect(capacityExceededResponse.body.message).toBe(
  //     'Event capacity reached',
  //   );
  // });
});
