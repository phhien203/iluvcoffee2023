import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { DataSource } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['Brand 1', 'Brand 2'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule],
  controllers: [CoffeesController],
  providers: [
    CoffeeBrandsFactory,
    CoffeesService,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (_dataSource: DataSource) => {
        const brands = await Promise.resolve(['brand 1', 'brand 2']);
        return brands;
      },
      inject: [DataSource],
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
