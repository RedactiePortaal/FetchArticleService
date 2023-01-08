export default interface Article {
  title: string;
  location: string;
  description: string;
  image: string | null;
  category: string | null;
  link: string;
  pubDate: Date;
}
