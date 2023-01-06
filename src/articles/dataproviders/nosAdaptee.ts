import { IArticleAdaptee } from './IArticleAdaptee';
import Article from '../entities/article.entity';
import axios from 'axios';
import { parseString } from 'xml2js';

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

  // retrieves all articles from all sources
  async findAll(): Promise<Article[]> {
    const articles: Article[] = await this.getArticlesPerSource();
    return articles;
  }

  // Retrieves all articles from all sources within the interval (in minutes)
  async findWithInterval(interval): Promise<Article[]> {
    // Calculate the itnerval date used to filter articles on later.
    const intervalDate = this.calculateInterval(interval);
    const articles: Article[] = await this.getArticlesPerSource(intervalDate);
    return articles;
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
      const xml = await axios.get(this.static_url + source);
      const parsed = this.XmlToDTOs(xml.data, interval);
      return parsed;
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
    const articles = articlesJson.item.map((article: any) =>
      this.JsonToEntity(article, interval, category),
    );

    return articles;
  }

  // Converts a single JSON article to a DTO
  // TODO is not actually a DTO, but a model
  private JsonToEntity(json: any, interval: Date, category): Article {
    // Date of the article, used to check if the article is within the interval
    const articleDate = this.parseDate(json.pubDate[0]);

    // Is there an interval, and is the article within the interval?
    if (interval && articleDate < interval) {
      return;
    }

    // Create the article DTO
    const article: Article = {
      title: json.title[0],
      // Cannot find a location in the RSS feed, so set to null
      location: null,
      description: json.description[0],
      image: json.enclosure[0].$.url,
      category: category,
      link: json.link[0],
      pubDate: articleDate,
    };
    return article;
  }

  private parseDate(date: string): Date {
    // Splitting up the date into the core parts required to create a new Date object
    // Date object is required for the interval check
    // TODO does not yet take GMT into account
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
    const intervalDate = new Date(
      // Milliseconds to seconds, to minutes
      curDate.getTime() - interval * 1000 * 60,
    );
    return intervalDate;
  }
}
