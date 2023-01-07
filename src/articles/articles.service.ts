import { Injectable } from '@nestjs/common';
import FlevoParser from './flevo-parser/flevo-parser';
import { ParsedArticleDTO } from './dto/parsed-article.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ArticlesService {
  constructor(private readonly httpService: HttpService) {}
  async findAll(interval: number): Promise<void> {
    const parser = new FlevoParser(this.httpService);
    const curDate = new Date();
    const intervalDate = new Date(
      // Milliseconds to seconds, to minutes
      curDate.getTime() - interval * 1000 * 60,
    );
    const articles: ParsedArticleDTO[] = await parser.getArticles(intervalDate);
    await articles.forEach((element) => this.sendToQueue(element));
    return;
  }

  async sendToQueue(article: ParsedArticleDTO): Promise<void> {
    await this.httpService.post(
      'http://localhost:1880/article/process',
      article,
    );
    return;
  }
}
