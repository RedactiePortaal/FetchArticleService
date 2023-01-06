import { IArticleAdaptee } from './IArticleAdaptee';
import Article from '../entities/article.entity';

export class NOSAdaptee implements IArticleAdaptee {
  async findAll(): Promise<Article[]> {
    return [];
  }

  async findWithInterval(interval: number): Promise<Article[]> {
    return [];
  }
}
