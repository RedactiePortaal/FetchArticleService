import { Controller, Get, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  // Source is the index of the data provider in the array
  // Interval in minutes
  @Get(':source/:interval')
  async findWithInterval(
    @Param('interval') interval: number,
    @Param('source') source: number,
  ) {
    return this.articlesService.findWithInterval(interval, source);
  }

  // Source is the index of the data provider in the array
  @Get(':source')
  async findAll(@Param('source') source: number) {
    return this.articlesService.findAll(source);
  }
}
