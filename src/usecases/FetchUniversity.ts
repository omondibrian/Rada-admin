import { ResultPayload } from "../Lib/utils/result";
import { IUniversityRepository } from "@Repositories/University.repository";

export class FetchUniversity {
  constructor(
    private readonly repo: IUniversityRepository,
    private readonly config: any
  ) {}
  async fetch(name: string): Promise<
    | ResultPayload<{
        name: string;
        _id: string;
      }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.fetchUniversity(name);
      return new ResultPayload<{
        name: string;
        _id: string;
      }>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to retrive the requested institution. Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
