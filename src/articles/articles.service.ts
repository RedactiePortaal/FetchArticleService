import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import FlevoParser from './flevo-parser/flevo-parser';
import { ParsedArticle } from './viewmodel/parsed-article.viewmodel';

@Injectable()
export class ArticlesService {


  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll() : Promise<ParsedArticle[]>{
    console.log('\n')
    const parser = new FlevoParser();
    let articles: ParsedArticle[] = await parser.getArticles();
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