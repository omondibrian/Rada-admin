import { IContact, IContactsRepository } from './../src/Repositories/contact.repository';
export class MockContact implements IContactsRepository{
    createContact(contact: IContact): Promise<IContact> {
        throw new Error('Method not implemented.');
    }
    editContact(contact: IContact): Promise<IContact> {
        throw new Error('Method not implemented.');
    }
    fechContacts(universityId: string): Promise<IContact[]> {
        throw new Error('Method not implemented.');
    }
    deleteContact(id: string): Promise<IContact> {
        throw new Error('Method not implemented.');
    }
}