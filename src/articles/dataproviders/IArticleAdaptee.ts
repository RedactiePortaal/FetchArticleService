import Article from '../entities/article.entity';

export interface IArticleAdaptee {
  // Find all articles
  findAll(): Promise<Article[]>;

  // Find all articles within the interval
  findWithInterval(interval: number): Promise<Article[]>;
}
