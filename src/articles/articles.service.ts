import { Injectable } from '@nestjs/common';
import FlevoParser from './flevo-parser/flevo-parser';
import { ParsedArticleDTO } from './dto/parsed-article.dto';

@Injectable()
export class ArticlesService {
  async findAll(interval: number): Promise<void> {
    const parser = new FlevoParser();
    const curDate = new Date();
    const intervalDate = new Date(
      curDate.getTime() - interval * 1000 * 60 * 60,
    );
    const articles: ParsedArticleDTO[] = await parser.getArticles(intervalDate);
    await this.sendToQueue(articles);
    return;
  }

  async sendToQueue(articles: ParsedArticleDTO[]): Promise<void> {
    // TODO
  }
}
