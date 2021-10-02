import { EditContact } from "../usecases/EditContact";
import { FetchContacts } from "../usecases/FetchContact";
import { CreateContact } from "../usecases/CreateContact";
import { DeleteContact } from "../usecases/DeleteContact";
import { ContactsRepository } from "@Repositories/contact.repository";

export class ContactServiceProvider {
  private readonly repo = new ContactsRepository();
  private config() {
    return {
      env: process.env.NODE_ENV,
      multiTenantMode: process.env.MODE === "true" ? true : false,
    };
  }

  addContact = new CreateContact(this.repo,this.config);
  fetchContact = new FetchContacts(this.repo,this.config);
  editContact = new EditContact(this.repo,this.config);
  deleteContact = new DeleteContact(this.repo,this.config);

}
