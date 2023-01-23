import {
  HttpServer,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception/http-exception.filter';
import { TimeoutInterceptor } from '../../src/common/interceptors/timeout/timeout.interceptor';
import { WrapResponseInterceptor } from '../../src/common/interceptors/wrap-response/wrap-response.interceptor';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';

describe('[Feature Coffees] - /coffees', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  const coffee = {
    name: 'Coffee 1',
    brand: 'Brand 1',
    flavors: ['chocolate', 'vanilla'],
  };
  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(
      new WrapResponseInterceptor(),
      new TimeoutInterceptor(),
    );

    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', () => {
    return request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        expect(body.data).toEqual(expectedPartialCoffee);
      });
  });
  it.todo('Get All [GET /]');
  it.todo('Get One [GET /:id]');
  it.todo('Update One [PATCH /:id]');
  it.todo('Delete One [DELETE /:id]');

  afterAll(async () => {
    await app.close();
  });
});
