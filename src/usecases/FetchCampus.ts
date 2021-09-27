import { ICampus } from "@Models/Campus.model";
import { ResultPayload } from "../Lib/utils/result";
import { IUniversityRepository } from "@Repositories/University.repository";

export class FetchCampus {
  constructor(
    private readonly repo: IUniversityRepository,
    private readonly config: any
  ) {}
  async fetch(
    universityId: string
  ): Promise<ResultPayload<Array<ICampus>> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.fetchCampus(universityId);
      return new ResultPayload<Array<ICampus>>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to retrive Avaliable Campus(es) . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
