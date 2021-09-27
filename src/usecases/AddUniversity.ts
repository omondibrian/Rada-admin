import { ResultPayload } from "../Lib/utils/result";
import { IUniversity } from "@Models/University.model";

import { IUniversityRepository } from "@Repositories/University.repository";

export class AddInstitution {
  constructor(
    private readonly repo: IUniversityRepository,
    private readonly config: any
  ) {}
  async add(
    university: IUniversity
  ): Promise<
    | ResultPayload<{ msg: string; institution: IUniversity }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      let result: IUniversity;
      if (this.config().multiTenantMode) {
        result = await this.repo.addUniversity(university);
      } else {
        const presentInstitutions =
          await this.repo.fetchNoUniversityRegistered();
        if (presentInstitutions > 0) {
          throw new Error("Running in single mode");
        } else {
          result = await this.repo.addUniversity(university);
        }
      }
      return new ResultPayload<{ msg: string; institution: IUniversity }>(
        { msg: "New Institution Added", institution: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to add new institution please check that you are currently running in multi-tenant mode";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
