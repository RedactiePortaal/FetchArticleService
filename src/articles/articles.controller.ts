import { Controller, Get, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get(':interval')
  async findAll(@Param('interval') interval: number) {
    return this.articlesService.findAll(interval);
  }
}
