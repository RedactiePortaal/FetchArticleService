import { Controller, Get, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get(':source/:interval')
  async findWithInterval(
    @Param('interval') interval: number,
    @Param('source') source: number,
  ) {
    return this.articlesService.findWithInterval(interval, source);
  }

  @Get(':source')
  async findAll(@Param('source') source: number) {
    return this.articlesService.findAll(source);
  }
}
