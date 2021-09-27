import { ICampus } from "@Models/Campus.model";
import { ResultPayload } from "../Lib/utils/result";
import { IUniversityRepository } from "@Repositories/University.repository";

export class AddCampus {
  constructor(
    private readonly repo: IUniversityRepository,
    private readonly config: any
  ) {}
  async add(
    campus: ICampus
  ): Promise<
    | ResultPayload<{ msg: string; campusDetails: ICampus }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.addCampus(campus);
      return new ResultPayload<{ msg: string; campusDetails: ICampus }>(
        { msg: "Successfully added new Campus", campusDetails: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to add new campus . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
