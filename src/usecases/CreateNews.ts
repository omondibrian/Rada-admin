import { ResultPayload } from "../Lib/utils/result";
import { Inews, INewsRepository } from "@Repositories/news.repository";

export class CreateNews {
  constructor(
    private readonly repo: INewsRepository,
    private readonly config: any
  ) {}
  async create(
    news: Inews
  ): Promise<
    | ResultPayload<{ msg: string; newsMetaData: Inews }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.createNews(news);
      return new ResultPayload<{ msg: string; newsMetaData: Inews }>(
        { msg: "Successfully created new record ", newsMetaData: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to create Record . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
