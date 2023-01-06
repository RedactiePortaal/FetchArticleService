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

  async findWithInterval(interval: number, source: number): Promise<void> {
    const adapter = new RSSAdapter(this.dataProviders[source]);
    const articles: Article[] = await adapter.adaptee.findWithInterval(
      interval,
    );
    await articles.forEach((element) => this.sendToQueue(element));
    return;
  }

  async findAll(source: number): Promise<void> {
    const adapter = new RSSAdapter(this.dataProviders[source]);
    const articles: Article[] = await adapter.adaptee.findAll();
    await articles.forEach((element) => this.sendToQueue(element));
    return;
  }

  async sendToQueue(article: Article): Promise<void> {
    console.log('Sending article to queue: ' + article.title);
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
