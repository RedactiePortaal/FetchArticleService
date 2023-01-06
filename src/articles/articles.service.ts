import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IArticleAdaptee } from './dataproviders/IArticleAdaptee';
import Article from './entities/article.entity';
import { FlevolandAdaptee } from './dataproviders/flevolandAdaptee';
import { NOSAdaptee } from './dataproviders/nosAdaptee';
import RSSAdapter from './dataproviders/rssadapter';

@Injectable()
export class ArticlesService {
  // Create an array of all the data providers
  private readonly dataProviders: IArticleAdaptee[] = [
    new FlevolandAdaptee(),
    new NOSAdaptee(),
  ];

  // Method for retrieving all articles from a specific source, with a given interval
  async findWithInterval(interval: number, source: number): Promise<void> {
    const adapter = new RSSAdapter(this.dataProviders[source]);
    const articles: Article[] = await adapter.adaptee.findWithInterval(
      interval,
    );

    // Send each element seperately to prevent flooding the articleprocessor
    await articles.forEach((element) => this.sendToQueue(element));
    return;
  }

  // Method for retrieving all articles from a specific source
  async findAll(source: number): Promise<void> {
    const adapter = new RSSAdapter(this.dataProviders[source]);
    const articles: Article[] = await adapter.adaptee.findAll();

    // Send each element seperately to prevent flooding the articleprocessor
    await articles.forEach((element) => this.sendToQueue(element));
    return;
  }

  // Method for sending an article to the articleprocessor
  async sendToQueue(article: Article): Promise<void> {
    // Check if article is undefined
    // SHOULD THIS BE DONE EARLIER? Probably, yes.
    if (article == undefined) {
      console.log('Article is undefined');
      return;
    }

    // Send the article to the articleprocessor
    await axios
      .post('http://localhost:1880/article/process', article)
      .catch(function (error) {
        return;
      });
    // No return needed, articles are sent to the articleprocessor
    return;
  }
}
