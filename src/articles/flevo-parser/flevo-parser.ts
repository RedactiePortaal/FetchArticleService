import axios from 'axios';
import { parse } from 'path';
import { ParsedArticleVM } from '../viewmodel/parsed-article.viewmodel';
import { parseString } from 'xml2js';
import { title } from 'process';

export default class FlevoParser {
  source = 'https://www.omroepflevoland.nl/RSS';

  constructor() {}

  public async getArticles(): Promise<ParsedArticleVM[]> {
    try {
      const xml = await axios.get(this.source);
      const parsed = this.XmlToViewModel(xml.data);
      return parsed;
    } catch {
      console.log('Error');
    }
    return [];
  }

  private XmlToViewModel(xml: string): ParsedArticleVM[] {
    const articlesJson = this.XmlToJSON(xml);
    const articles = articlesJson.map((article: any) =>
      this.JsonToViewModel(article),
    );
    return articles;
  }

  private JsonToViewModel(json: any): ParsedArticleVM {
    const article: ParsedArticleVM = {
      title: json.title[0],
      description: this.parseDescription(json.description[0]),
      image: json.image[0],
      category: json.category[0],
      link: json.link[0],
      pubDate: json.pubDate[0],
    };
    return article;
  }

  private parseDescription(description: string): string {
    let parsed_tags = description.replace(/<[^>]+>/g, ''); // Removes all HTML tags
    let parsed_whitespace = parsed_tags.replace(/ {2,}/g, ''); // Removes all whitespace
    let parsed_literals = parsed_whitespace.replace(/\\/g, ''); // Removes all literals <- THIS DOES NOT WORK idk why
    return parsed_literals;
  }

  private XmlToJSON(source: string): any {
    try {
      let xml = '';
      parseString(source, (error, result) => {
        if (error) {
          console.log(error);
          return null;
        }
        xml = result.rss.channel[0].item; // articles
      });
      return xml;
    } catch (e) {
      console.log(e);
    }
    return '';
  }
}
