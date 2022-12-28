import axios from 'axios';
import { parse } from 'path';
import { ParsedArticleVM } from '../viewmodel/parsed-article.viewmodel';
import { parseString } from 'xml2js';

export default class FlevoParser {
    source: string ='https://www.omroepflevoland.nl/RSS'

    constructor(){
    }

    public async getArticles(): Promise<ParsedArticle[]> {
        try{
            const xml = await axios.get(this.source);
            const parsed = this.XmlToViewModel(xml.data);
            return parsed;
        } catch
        {
            console.log('Error');
        }
        return [];
    }

    private XmlToViewModel(xml: string): ParsedArticle[] {
        let articlesJson = this.XmlToJSON(xml);
        let articles = articlesJson.map((article: any) => this.JsonToViewModel(article));
        return articles;
    }

    private JsonToViewModel(json: any): ParsedArticle {
        let article : ParsedArticleVM = {
            title: json.title[0],
            description: this.parseDescription(json.description[0]),
            image: json.image[0],
            category: json.category[0],
            link: json.link[0],
            pubDate: json.pubDate[0]
        };
        return article;
    }

    private parseDescription(description: string): string {
        description = description.replace(/<\/?[^>]+(>|$)/g, ""); // removes html tags
        description = description.replace(/(\\n)|( {2,})/g, ""); // removes newlines and multiple spaces
        return description

    }
    

    private XmlToJSON(source: string): any {
        try {
            var xml = "";
            parseString(source, (error, result) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                xml = result.rss.channel[0].item; // articles
            });
            return xml;
        }
        catch (e) {
            console.log(e);
        }
        return "";
    }
}