import { ICampus } from "@Models/Campus.model";
import { ResultPayload } from "../Lib/utils/result";
import { IUniversity } from "@Models/University.model";
import { IUniversityRepository } from "@Repositories/University.repository";

export class RemoveUniversityOrCampus {
  constructor(
    private readonly repo: IUniversityRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string,
    isCampus: boolean
  ): Promise<
    | ResultPayload<{ msg: string; record: IUniversity | ICampus }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.removeUniversityOrCampus(id, isCampus);
      return new ResultPayload<{ msg: string; record: IUniversity | ICampus }>(
        { msg: "Succesfully deleted the requested record", record: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to remove record . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
