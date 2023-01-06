import { Injectable } from '@nestjs/common';
import FlevoParser from './flevo-parser/flevo-parser';
import { ParsedArticleDTO } from './dto/parsed-article.dto';
import axios from '@nestjs/axios';

@Injectable()
export class ArticlesService {
  async findAll(interval: number): Promise<void> {
    const parser = new FlevoParser();
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
    await axios
      .post('http://localhost:1880/article/process', article)
      .then(function (response) {
        console.log(response.status);
      })
      .catch(function (error) {
        return;
      });
    return;
  }
}
