import { IContent, IContentRepository } from "@Rada/src/Repositories/content.repository";

export class MockContent implements IContentRepository{
    createContent(data: IContent): Promise<IContent> {
        throw new Error("Method not implemented.");
    }
    fetchContents(): Promise<IContent[]> {
        throw new Error("Method not implemented.");
    }
    fetchContent(id: string): Promise<IContent> {
        throw new Error("Method not implemented.");
    }
    EditContent(id: string, data: IContent): Promise<IContent> {
        throw new Error("Method not implemented.");
    }
    DeleteContent(id: string): Promise<IContent> {
        throw new Error("Method not implemented.");
    }
}