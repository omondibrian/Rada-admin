import { ResultPayload } from "../Lib/utils/result";
import { Inews, INewsRepository } from "@Repositories/news.repository";

export class FetchNews {
  constructor(
    private readonly repo: INewsRepository,
    private readonly config: any
  ) {}
  async fetch(
    universityId: string
  ): Promise<ResultPayload<Array<Inews>> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.fetchNews(universityId);
      return new ResultPayload<Array<Inews>>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to fetch news Records . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
