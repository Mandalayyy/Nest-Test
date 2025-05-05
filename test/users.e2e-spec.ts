import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Users (e2e)', () => {
  let app;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prisma.participant.deleteMany();
    await prisma.event.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user', async () => {
    const username = `user${Date.now()}`;
    const email = `user${Date.now()}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        username,
        email,
        password: 'password',
      })
      .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.username).toBe(username);
  });

  // it('should login user and return JWT token', async () => {
  //   const email = `user${Date.now()}@example.com`;

  //   // Спочатку зареєструємо користувача
  //   await request(app.getHttpServer())
  //     .post('/users/register')
  //     .send({
  //       username: 'testuser',
  //       email,
  //       password: 'password',
  //     })
  //     .expect(201);

  //   // Потім виконаємо логін
  //   const response = await request(app.getHttpServer())
  //     .post('/users/login')
  //     .send({
  //       email: 'user1@example.com',
  //       password: 'password',
  //     })
  //     .expect(200);
  //   token = response.body.token; // Assign the token for reuse
  //   expect(response.body).toHaveProperty('token');
  //   expect(response.body).toHaveProperty('user');
  // });

  // it('should access a protected route with JWT', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/events')
  //     .set('Authorization', `Bearer ${token}`)
  //     .expect(200);

  //   expect(response.body).toBeInstanceOf(Array);
  // });
});
