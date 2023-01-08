import { Injectable } from '@nestjs/common';
import { IArticleAdaptee } from './dataproviders/IArticleAdaptee';
import Article from './entities/article.entity';
import { FlevolandAdaptee } from './dataproviders/flevolandAdaptee';
import { NOSAdaptee } from './dataproviders/nosAdaptee';
import RSSAdapter from './dataproviders/rssadapter';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ArticlesService {
  constructor(private readonly httpService: HttpService) {}

  // Create an array of all the data providers
  private readonly dataProviders: IArticleAdaptee[] = [
    new FlevolandAdaptee(),
    new NOSAdaptee(),
  ];

  // Method for retrieving all articles from a specific source, with a given interval
  async findWithInterval(interval: number, source: number): Promise<void> {
    const adapter = new RSSAdapter(this.dataProviders[source]);
    const articles: Article[] = await adapter.findWithInterval(interval);

    // Send each element seperately to prevent flooding the articleprocessor
    await articles.forEach((element) => this.sendToQueue(element));
    return;
  }

  // Method for retrieving all articles from a specific source
  async findAll(source: number): Promise<void> {
    const adapter = new RSSAdapter(this.dataProviders[source]);
    const articles: Article[] = await adapter.findAll();

    // Send each element seperately to prevent flooding the articleprocessor
    await articles.forEach((element) => this.sendToQueue(element));
    return;
  }

  // Method for sending an article to the articleprocessor
  async sendToQueue(article: Article): Promise<void> {
    if (article == undefined) {
      console.log('Article is undefined');
      return;
    }

    // Send the article to the articleprocessor
    await this.httpService.post(
      'http://localhost:1880/article/process',
      article,
    );

    // No return needed, articles are sent to the articleprocessor
    return;
  }
}
