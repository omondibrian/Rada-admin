import { ResultPayload } from "../Lib/utils/result";
import {
  IContact,
  IContactsRepository,
} from "../Repositories/contact.repository";

export class DeleteContact {
  constructor(
    private readonly repo: IContactsRepository,
    private readonly config: any
  ) {}
  async remove(
    id: string
  ): Promise<ResultPayload<IContact> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.deleteContact(id);
      return new ResultPayload<IContact>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to remove Contact Record . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
