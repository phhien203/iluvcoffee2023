import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import coffeesConfig from './coffees.config';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let mockCoffeeRepository: MockRepository<Coffee>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: coffeesConfig.KEY,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    mockCoffeeRepository = module.get<MockRepository<Coffee>>(
      getRepositoryToken(Coffee),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('METHOD: findOne', () => {
    it('should return Coffee when Coffee Id exists', async () => {
      // GIVEN
      const fakeCoffeeId = '1';
      const expectedCoffee = {};
      mockCoffeeRepository.findOne.mockReturnValue(expectedCoffee);

      // WHEN
      const coffee = await service.findOne(fakeCoffeeId);

      // THEN
      expect(mockCoffeeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { flavors: true },
      });
      expect(coffee).toEqual(expectedCoffee);
    });

    it('should throw exception when Coffee not found', async () => {
      // GIVEN
      const fakeCoffeeId = '1';
      mockCoffeeRepository.findOne.mockReturnValue(undefined);

      try {
        // WHEN
        await service.findOne(fakeCoffeeId);
        expect(false).toBeTruthy(); // should never hit this line
      } catch (err) {
        // THEN
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toBe(`Coffee id ${fakeCoffeeId} not found`);
      }
    });
  });
});
