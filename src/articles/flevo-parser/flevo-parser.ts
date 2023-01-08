import axios from '@nestjs/axios';
import { ParsedArticleDTO } from '../dto/parsed-article.dto';
import { parseString } from 'xml2js';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export default class FlevoParser {
  constructor(private readonly httpService: HttpService) {}
  source = 'https://www.omroepflevoland.nl/RSS';

  // Retrieves the XML from the RSS source and converts it to articles
  public async getArticles(interval: Date): Promise<ParsedArticleDTO[]> {
    try {
      /* Retrieving XML from the RSS source and converting it to a collection of articles */
      const xml = await firstValueFrom(this.httpService.get(this.source));
      const parsed = this.XmlToDTOs(xml.data, interval);
      return parsed;
    } catch {
      console.log('Error');
    }
    return [];
  }

  // Converts the XML to JSON and returns all articles within the interval
  private XmlToDTOs(xml: string, interval: Date): ParsedArticleDTO[] {
    const articlesJson = this.XmlToJSON(xml);

    // Loop the article collection and conver them to DTOs
    const articles = articlesJson.map((article: any) =>
      this.JsonToDTO(article, interval),
    );

    return articles;
  }

  // Converts JSON object to a DTO
  private JsonToDTO(json: any, interval: Date): ParsedArticleDTO | null {
    // Check if the article is within the interval
    const articleDate = this.ParseDate(json.pubDate[0]);
    if (articleDate < interval) {
      return;
    }

    // Title format is "Location - Title"
    const splitTitle = json.title[0].split(' - ');

    // Creating a parsed article
    const article: ParsedArticleDTO = {
      location: splitTitle[0],
      title: splitTitle[1],
      description: json.description[0],
      image: json.image[0],
      category: json.category[0],
      link: json.link[0],
      pubDate: this.ParseDate(json.pubDate[0]),
    };

    return article;
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
        // parses the JSON, returns index 0 of the channel as there is only one RSS channel
        xml = result.rss.channel[0].item;
      });
      return xml;
    } catch (e) {
      console.log(e);
    }
    return '';
  }

  private ParseDate(date: string): Date {
    // Splitting up the date into the essential parts required to create a new Date object
    // Date object is required for the interval check

    const splitDate = date.split(' ');
    const day = splitDate[1];
    const month = splitDate[2];
    const year = splitDate[3];
    const time = splitDate[4];

    return new Date(`${day} ${month} ${year} ${time}`);
  }
}
