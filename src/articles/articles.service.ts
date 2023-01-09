import { Injectable } from '@nestjs/common';
import { IArticleAdaptee } from './dataproviders/IArticleAdaptee';
import Article from './entities/article.entity';
import { FlevolandAdaptee } from './dataproviders/flevolandAdaptee';
import { NOSAdaptee } from './dataproviders/nosAdaptee';
import RSSAdapter from './dataproviders/rssadapter';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class ArticlesService {
  private readonly dataProviders: IArticleAdaptee[] = [];

  constructor(
    private readonly httpService: HttpService,
    private readonly flevolandAdaptee: FlevolandAdaptee,
    private readonly nosAdaptee: NOSAdaptee,
  ) {
    this.dataProviders.push(flevolandAdaptee, nosAdaptee);
  }

  // Method for retrieving all articles from a specific source, with a given interval
  async findWithInterval(interval: number, source: number): Promise<void> {
    const adapter = new RSSAdapter(this.dataProviders[source]);
    const articles: Article[] = await adapter.findWithInterval(interval);

    // Send each element seperately to prevent flooding the articleprocessor
    for (const article of articles) {
      await this.sendToQueue(article);
    }

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
    if (article == null) {
      console.log('Article is undefined or null');
      return;
    }

    console.log('sending article: ', article);

    // Send the article to the articleprocessor
    try {
      await firstValueFrom(
        this.httpService
          .post(
            `http://${
              process.env.PROCESS_ARTICLE_SERVICE_URL || 'localhost'
            }/article/process`,
            article,
          )
          .pipe(
            catchError((error) => {
              console.log(error);
              throw 'error';
            }),
          ),
      );
    } catch (e) {}

    // No return needed, articles are sent to the articleprocessor
    return;
  }
}
