import { ResultPayload } from "../Lib/utils/result";
import {
  IFaculty,
  IUniversityRepository,
} from "@Repositories/University.repository";

export class AddFaculty {
  constructor(
    private readonly repo: IUniversityRepository,
    private readonly config: any
  ) {}
  async add(
    faculty: IFaculty
  ): Promise<
    | ResultPayload<{ msg: string; facultyMetadata: IFaculty }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.addFaculty(faculty);
      return new ResultPayload<{ msg: string; facultyMetadata: IFaculty }>(
        { msg: "Successfully added new Faculty", facultyMetadata: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to add new faculty . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
