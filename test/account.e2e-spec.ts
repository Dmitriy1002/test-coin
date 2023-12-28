// account.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { AccountsModule } from 'src/accounts/accounts.module';

describe('AccountsController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.cleanDatabase();
  });

  it('/accounts (POST)', () => {
    return request(app.getHttpServer())
      .post('/accounts')
      .send({ username: 'testuser' })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body).toHaveProperty('accountId');
      });
  });

  it('/accounts/:id (GET)', async () => {
    // Создаем аккаунт, чтобы получить его ID
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({ username: 'testuser' });

    const accountId = response.body.accountId;

    return request(app.getHttpServer())
      .get(`/accounts/${accountId}`)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', accountId);
        expect(res.body).toHaveProperty('username', 'testuser');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});