import { config } from "dotenv";
import { ContactsRepository, IContact } from "@Repositories/contact.repository";

config();

describe("ContactsRepository", () => {
  const repository = new ContactsRepository();
  const contact: IContact = {
    name: "Test contact",
    email: "test@email.com",
    phone: "+25412345671",
    Campuses_id: "1",
    University_id: "1",
  };
  let contactId = 0;
  describe("ContactsRepository - createContact ", () => {
    it("should create new contact for particular contact", async () => {
      const result = await repository.createContact(contact);
      contactId = result._id as number;
      expectPositveContactResult(result, contact);
    });
  });

  const updatedContact: IContact = {
    _id: contactId,
    name: "Test updated contact",
    email: "testUpdatedemail@email.com",
    phone: "+25412345678",
    Campuses_id: "1",
    University_id: "1",
  };
  describe("ContactsRepository - editContact", () => {
    it("should successfully update an existing contact", async () => {
      const result = await repository.editContact(updatedContact);
      expectPositveContactResult(result, updatedContact);
    });
  });
  describe("ContactsRepository - fetchContacts", () => {
    it("should return a list of all available contacts based on the university", async () => {
      const universityId = "1";
      const result = await repository.fechContacts(universityId);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("ContactsRepository - deleteContact", () => {
    it("should remove the selected contact from the database", async () => {
      const result = await repository.deleteContact(contactId.toString());
      expectPositveContactResult(result, updatedContact);
    });
  });
});

function expectPositveContactResult(
  result: IContact,
  updatedContact: IContact
) {
  expect(result.name).toEqual(updatedContact.name);
  expect(result.email).toEqual(updatedContact.email);
  expect(result.phone).toEqual(updatedContact.phone);
  expect(result.Campuses_id).toEqual(updatedContact.Campuses_id);
  expect(result.campus).toEqual("Njoro");
}
