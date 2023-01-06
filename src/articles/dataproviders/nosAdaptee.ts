import { IArticleAdaptee } from './IArticleAdaptee';
import Article from '../entities/article.entity';
import axios from 'axios';

export class NOSAdaptee implements IArticleAdaptee {
  source = 'https://feeds.nos.nl/nosnieuwsalgemeen';

  async findAll(): Promise<Article[]> {
    const articles: Article[] = await this.getArticles(null);
    return articles;
  }

  async findWithInterval(interval): Promise<Article[]> {
    const intervalDate = this.calculateInterval(interval);
    const articles: Article[] = await this.getArticles(intervalDate);
    return articles;
  }

  private async getArticles(interval: Date): Promise<Article[]> {
    try {
      const xml = await axios.get(this.source);
      console.log(xml);
      return [];
    } catch {
      console.log('Error');
    }
    return [];
  }

  // Fix something about duplicate code
  calculateInterval(interval: number): Date {
    const curDate = new Date();
    const intervalDate = new Date(
      // Milliseconds to seconds, to minutes
      curDate.getTime() - interval * 1000 * 60,
    );
    return intervalDate;
  }
}
