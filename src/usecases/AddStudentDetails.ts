import { IStudent } from "@Models/Student.model";
import { ResultPayload } from "../Lib/utils/result";
import { IUserRepository } from "@Repositories/User.repository";

export class AddStudentDetails {
  constructor(
    private readonly repo: IUserRepository,
    private readonly config: any
  ) {}
  async add(
    user: IStudent
  ): Promise<
    | ResultPayload<{ msg: string; isAdded: boolean }>
    | ResultPayload<Error>
    | undefined
  > {
    try {
      const result = await this.repo.addStudentDetails(user);
      return new ResultPayload<{ msg: string; isAdded: boolean }>(
        { msg: "New Student Added", isAdded: result },
        200
      );
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to add new Student.Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
