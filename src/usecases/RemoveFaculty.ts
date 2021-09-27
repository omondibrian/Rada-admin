import { ResultPayload } from "../Lib/utils/result";
import { IFaculty, IUniversityRepository } from "@Repositories/University.repository";

export class RemoveFaculty {
  constructor(
    private readonly repo: IUniversityRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string,
 
  ): Promise<
    | ResultPayload<{ msg: string; record: IFaculty }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.removeFaculty(id);
      return new ResultPayload<{ msg: string; record: IFaculty }>(
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
