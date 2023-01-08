import { IArticleAdaptee } from './IArticleAdaptee';

class RSSAdapter {
  constructor(private readonly adaptee: IArticleAdaptee) {}

  findWithInterval = (interval: number) => {
    return this.adaptee.findWithInterval(interval);
  };

  findAll = () => {
    return this.adaptee.findAll();
  };
}

export default RSSAdapter;
