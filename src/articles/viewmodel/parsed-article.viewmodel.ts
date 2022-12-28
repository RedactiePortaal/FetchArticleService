export class ParsedArticle {
    title: string;
    description: string;
    image: Date | null; //Is this nullable?
    category: string;
    link: string;
    pubDate: Date;
}
