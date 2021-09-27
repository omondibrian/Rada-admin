import { ResultPayload } from "../Lib/utils/result";
import { Inews, INewsRepository } from "@Repositories/news.repository";

export class DeleteNews {
  constructor(
    private readonly repo: INewsRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string
  ): Promise<ResultPayload<Inews> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.deleteNews(id);
      return new ResultPayload<Inews>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to remove Record . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
