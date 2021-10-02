import { ContentRepository } from "@Repositories/content.repository";
import { CreateContent } from "../usecases/CreateContent";
import { DeleteContent } from "../usecases/DeleteContent";
import { EditContent } from "../usecases/EditContent";
import { FetchContent } from "../usecases/FetchContent";
import { FetchContents } from "../usecases/FetchContents";

export class ContentService {
    private readonly repo = new ContentRepository();
    private config() {
        return {
          env: process.env.NODE_ENV,
          multiTenantMode: process.env.MODE === "true" ? true : false,
        };
      }
    
    addContent = new CreateContent(this.repo,this.config);
    fetchContents = new FetchContents(this.repo,this.config);
    fetchContent = new FetchContent(this.repo,this.config);
    updateContent = new EditContent(this.repo,this.config);
    deleteContent = new DeleteContent(this.repo,this.config);
}