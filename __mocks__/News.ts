import { Inews, INewsRepository } from "@Rada/src/Repositories/news.repository";

export class MockNews implements INewsRepository{
    createNews(news: Inews): Promise<Inews> {
        throw new Error("Method not implemented.");
    }
    fetchNews(): Promise<Inews[]> {
        throw new Error("Method not implemented.");
    }
    deleteNews(id: string): Promise<Inews> {
        throw new Error("Method not implemented.");
    }
    
}