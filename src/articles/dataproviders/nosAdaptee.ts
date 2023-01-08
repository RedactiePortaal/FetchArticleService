import { IArticleAdaptee } from './IArticleAdaptee';
import Article from '../entities/article.entity';
import { parseString } from 'xml2js';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NOSAdaptee implements IArticleAdaptee {
  // The RSS source
  static_url = 'https://feeds.nos.nl/';
  // All unique endpoints
  sources = [
    'nosnieuwsalgemeen',
    'nosnieuwsbinnenland',
    'nosnieuwsbuitenland',
    'nosnieuwsopmerkelijk',
    'nosnieuwseconomie',
    'nosnieuwspolitiek',
    'nosnieuwskoningshuis',
    'nosnieuwscultuurenmedia',
    'nosnieuwstech',
    'nossportwielrennen',
    'nosvoetbal',
    'nossportalgemeen',
    'nossportschaatsen',
    'nossporttennis',
    'nossportformule1',
    'jeugdjournaal',
    'nosop3',
    'nieuwsuuralgemeen',
  ];

  constructor(private readonly httpService: HttpService) {}

  // retrieves all articles from all sources
  async findAll(): Promise<Article[]> {
    return await this.getArticlesPerSource();
  }

  // Retrieves all articles from all sources within the interval (in minutes)
  async findWithInterval(interval): Promise<Article[]> {
    // Calculate the interval date used to filter articles on later.
    const intervalDate = this.calculateInterval(interval);
    return await this.getArticlesPerSource(intervalDate);
  }

  // parameter not yet typed
  private async getArticlesPerSource(interval = null): Promise<Article[]> {
    const articles: Article[] = [];

    // Loop over all endpoints and retrieve the articles
    for (const source of this.sources) {
      const sourceArticles = await this.getArticles(interval, source);
      articles.push(...sourceArticles);
    }
    return articles;
  }

  private async getArticles(interval: Date, source): Promise<Article[]> {
    try {
      // Combining static url and endpoint for full url
      const xml = await firstValueFrom(
        this.httpService.get(this.static_url + source),
      );
      return this.XmlToDTOs(xml.data, interval);
    } catch (e) {
      console.log(e);
    }
    // If something goes wrong, return an empty array
    return [];
  }

  // Converts the XML to JSON and returns all articles within the interval
  private XmlToDTOs(xml: string, interval: Date): Article[] {
    const articlesJson = this.XmlToJSON(xml);
    const category = articlesJson.description[0];

    // Loop the article collection and conver them to DTOs
    return articlesJson.item.map((article: any) =>
      this.JsonToEntity(article, interval, category),
    );
  }

  // Converts a single JSON article to a DTO
  private JsonToEntity(json: any, interval: Date, category): Article {
    // Date of the article, used to check if the article is within the interval
    const articleDate = this.parseDate(json.pubDate[0]);

    // Is there an interval, and is the article within the interval?
    if (interval && articleDate < interval) {
      return;
    }

    // Create the article DTO
    return {
      title: json.title[0],
      // Cannot find a location in the RSS feed, so set to null
      location: null,
      description: json.description[0],
      image: json.enclosure[0].$.url,
      category: category,
      link: json.link[0],
      pubDate: articleDate,
    };
  }

  private parseDate(date: string): Date {
    // Splitting up the date into the core parts required to create a new Date object
    // Date object is required for the interval check
    const splitDate = date.split(' ');
    const day = splitDate[1];
    const month = splitDate[2];
    const year = splitDate[3];
    const time = splitDate[4];

    return new Date(`${day} ${month} ${year} ${time}`);
  }

  // Converts the XML RSS Feed to a JSON object
  private XmlToJSON(source: string): any {
    try {
      // Predefine XML for later reference
      let xml = '';

      // Parse the XML to JSON
      parseString(source, (error, result) => {
        if (error) {
          console.log(error);
          return null;
        }

        // parses the JSON, returns index 0 of the channel
        xml = result.rss.channel[0];
      });
      return xml;
    } catch (e) {
      console.log(e);
    }
    return '';
  }

  // Fix something about duplicate code
  private calculateInterval(interval: number): Date {
    const curDate = new Date();
    return new Date(
      // Milliseconds to seconds, to minutes
      curDate.getTime() - interval * 1000 * 60,
    );
  }
}
