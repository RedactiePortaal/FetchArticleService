import { IArticleAdaptee } from './IArticleAdaptee';
import Article from '../entities/article.entity';

class RSSAdapter {
  constructor(private readonly adaptee: IArticleAdaptee) {}

  findWithInterval = async (interval: number): Promise<Article[]> => {
    return this.adaptee.findWithInterval(interval);
  };

  findAll = async (): Promise<Article[]> => 
    return this.adaptee.findAll();
  };
}

export default RSSAdapter;
