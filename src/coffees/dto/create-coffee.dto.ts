import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of coffee' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The brand of coffee' })
  @IsString()
  readonly brand: string;

  @ApiProperty({ description: 'The flavors of coffee', default: [] })
  @IsString({ each: true })
  readonly flavors: string[];
}
