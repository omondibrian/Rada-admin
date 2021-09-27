import { ResultPayload } from "../Lib/utils/result";
import { IContent, IContentRepository } from "@Repositories/content.repository";

export class DeleteContent {
  constructor(
    private readonly repo: IContentRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string
  ): Promise<
    ResultPayload<IContent> | ResultPayload<Error> | undefined
  > {
    try {
      const result = await this.repo.DeleteContent(id);
      return new ResultPayload<IContent>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to remove Record . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
