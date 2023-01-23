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
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';

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

  it('Create [POST /]', async () => {
    const { body } = await request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
    expect(body.data).toEqual(expectedPartialCoffee);
  });

  it('Get All [GET /]', async () => {
    const { body } = await request(httpServer).get('/coffees');
    console.log(body);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toEqual(expectedPartialCoffee);
  });

  it('Get One [GET /:id]', async () => {
    return request(httpServer)
      .get('/coffees/1')
      .then(({ body }) => {
        console.log(body);
        expect(body.data).toEqual(expectedPartialCoffee);
      });
  });

  it('Update One [PATCH /:id]', () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New coffee name',
    };

    return request(httpServer)
      .patch('/coffees/1')
      .send(updateCoffeeDto)
      .then(({ body }) => {
        console.log(body.data);
        expect(body.data.name).toEqual(updateCoffeeDto.name);

        return request(httpServer)
          .get('/coffees/1')
          .then(({ body }) => {
            expect(body.data.name).toEqual(updateCoffeeDto.name);
          });
      });
  });

  it('Delete One [DELETE /:id]', () => {
    return request(httpServer)
      .delete('/coffees/1')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(httpServer)
          .get('/coffees/1')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
