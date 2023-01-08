export interface ParsedArticleDTO {
  category: string;
  description: string;
  image: string | null;
  link: string;
  location: string;
  pubDate: Date;
  title: string;
}
