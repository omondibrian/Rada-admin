import { ResultPayload } from "../Lib/utils/result";
import {
  IContact,
  IContactsRepository,
} from "../Repositories/contact.repository";

export class CreateContact {
  constructor(
    private readonly repo: IContactsRepository,
    private readonly config: any
  ) {}
  async create(
    contact: IContact
  ): Promise<ResultPayload<IContact> | ResultPayload<Error> | undefined> {
    try {
      const result = await this.repo.createContact(contact);
      return new ResultPayload<IContact>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to create Record . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
