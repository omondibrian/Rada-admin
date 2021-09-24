/**
 * @fileOverview contains the various functions to manage contacts data.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { config } from "dotenv";
import TableNames from "../Lib/constants";
import { ICampus } from "@Models/Campus.model";
import { DataBaseConnection } from "../Lib/db/connection";

config();

export interface IContactsRepository {
  createContact(contact: IContact): Promise<IContact>;
  editContact(contact: IContact): Promise<IContact>;
  fechContacts(universityId: string): Promise<Array<IContact>>;
  deleteContact(id: string): Promise<IContact>;
}

export interface IContact {
  _id?: number;
  name: string;
  email: string;
  phone: string;
  Campuses_id: string;
  University_id: string;
  campus?: string;
}

export class ContactsRepository implements IContactsRepository {
  private knexConn = new DataBaseConnection().getConnection();
  private contactPayload = [
    "_id",
    "name",
    "email",
    "phone",
    "Campuses_id",
    "University_id",
  ];
  private contactsReturnPayload(newContact: any): IContact {
    return {
      _id: newContact._id,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      Campuses_id: newContact.Campuses_id.toString(),
      University_id: newContact.University_id.toString(),
      campus: newContact.campus,
    };
  }
  async createContact(contact: IContact): Promise<IContact> {
    const [newContact] = await this.knexConn<IContact>(
      TableNames.Contacts
    ).insert(contact, this.contactPayload);
    const [campus] = await this.knexConn<ICampus>(TableNames.Campuses)
      .select("name")
      .where("_id", "=", newContact.Campuses_id);
    newContact.campus = campus.name;
    return this.contactsReturnPayload(newContact);
  }

  async editContact(contact: IContact): Promise<IContact> {
    const id = contact._id;
    delete contact._id;
    const [updatedContact] = await this.knexConn<IContact>(
      TableNames.Contacts
    ).update(contact, this.contactPayload);
    const [campus] = await this.knexConn<ICampus>(TableNames.Campuses)
      .select("name")
      .where("_id", "=", updatedContact.Campuses_id);
    updatedContact.campus = campus.name;
    return this.contactsReturnPayload(updatedContact);
  }
  async fechContacts(universityId: string): Promise<IContact[]> {
    const contacts = await this.knexConn<IContact>(TableNames.Contacts)
      .select(...this.contactPayload)
      .where("University_id", "=", universityId);
    return contacts.map((contact) => this.contactsReturnPayload(contact));
  }
  async deleteContact(id: string): Promise<IContact> {
    const [contact] = await this.knexConn<IContact>(TableNames.Contacts)
      .returning(this.contactPayload)
      .where("_id", "=", id)
      .delete(this.contactPayload);
    const [campus] = await this.knexConn<ICampus>(TableNames.Campuses)
      .select("name")
      .where("_id", "=", contact.Campuses_id);
    contact.campus = campus.name;
    return this.contactsReturnPayload(contact);
  }
}
