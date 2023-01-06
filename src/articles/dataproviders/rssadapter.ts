import { IArticleAdaptee } from './IArticleAdaptee';

class RSSAdapter {
  public adaptee: IArticleAdaptee;

  constructor(adaptee: IArticleAdaptee) {
    this.adaptee = adaptee;
  }
}

export default RSSAdapter;
