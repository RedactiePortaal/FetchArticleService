import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import FlevoParser from './flevo-parser/flevo-parser';
import { ParsedArticleDTO } from './dto/parsed-article.dto';

@Injectable()
export class ArticlesService {
  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll(interval: number): Promise<ParsedArticleDTO[]> {
    const parser = new FlevoParser();
    const curDate = new Date();
    const intervalDate = new Date(curDate.getTime() - interval * 1000 * 60 * 60);
    const articles: ParsedArticleDTO[] = await parser.getArticles(intervalDate);
    return articles;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
