import { ResultPayload } from "../Lib/utils/result";
import {
  IContact,
  IContactsRepository,
} from "../Repositories/contact.repository";

export class FetchContacts {
  constructor(
    private readonly repo: IContactsRepository,
    private readonly config: any
  ) {}
  async fetch(
    id: string
  ): Promise<
    ResultPayload<Array<IContact>> | ResultPayload<Error> | undefined
  > {
    try {
      const result = await this.repo.fechContacts(id);
      return new ResultPayload<Array<IContact>>(result, 200);
    } catch (error: any) {
      const msg =
        this.config().env !== "production"
          ? error.message
          : "Unable to retrive contact Records . Please retry";
      return new ResultPayload<Error>(new Error(msg), 500);
    }
  }
}
