import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;
    return `This returns all coffees, limit ${limit}, offset ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns coffee ${id}`;
  }

  @Post()
  create(@Body() body) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return `This action update coffee ${id}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action remove coffee ${id}`;
  }
}
