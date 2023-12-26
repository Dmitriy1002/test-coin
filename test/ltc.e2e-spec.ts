import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { LitecoinModule } from 'src/ltc/ltc.module';

describe('LitecoinService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LitecoinModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ltc/create-account (POST)', () => {
    return request(app.getHttpServer())
      .post('/ltc/create-account')
      .send({ accountId: 'testAccountId' })
      .expect(HttpStatus.CREATED)
      .then((response) => {
        expect(response.body).toHaveProperty('ltcAddress');
      });
  });

  it('/ltc/send-funds (POST)', () => {
    return request(app.getHttpServer())
      .post('/ltc/send-funds')
      .send({ accountId: 'testAccountId', amount: 100, recipientAddress: 'recipientAddress' })
      .expect(HttpStatus.OK);
  });

  it('/ltc/balance/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/ltc/balance/testAccountId')
      .expect(HttpStatus.OK)
      .then((response) => {
        expect(response.body).toHaveProperty('ltcBalance');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
