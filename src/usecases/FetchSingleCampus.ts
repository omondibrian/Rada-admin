import { ICampus } from "@Models/Campus.model";
import { ResultPayload } from "../Lib/utils/result";
import { IUniversityRepository } from "@Repositories/University.repository";

export class FetchSingleCampus {
  constructor(
    private readonly repo: IUniversityRepository,
    private readonly config: any
  ) {}
  async fetch(
    name: string
  ): Promise<ResultPayload<ICampus> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.fetchCampusByName(name);
      return new ResultPayload<ICampus>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to retrive  the requested campus . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
