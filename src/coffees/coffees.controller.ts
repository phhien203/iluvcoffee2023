import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get('flavors')
  findAll() {
    return 'This returns all coffees';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns coffee ${id}`;
  }

  @Post()
  create(@Body() body) {
    return body;
  }
}
