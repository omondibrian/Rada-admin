import { MockContact } from "@Rada/__mocks__/contact";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IContact } from "@Repositories/contact.repository";
import { EditContact } from "@Rada/src/usecases/EditContact";

describe("Edit Contact - Usecase", () => {
  const repo = new MockContact();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new EditContact(repo, config);

  const contactId = 1;
  const contact: IContact = {
    name: "test",
    email: "test@site.com",
    phone: "+254123456789",
    Campuses_id: "1",
    University_id: "1",
    _id:contactId
  };
  it("should successfully update the specified contact", async () => {
    const mockEditContact = jest
      .spyOn(repo, "editContact")
      .mockResolvedValue(contact);

    const result = await usecase.mod(contact);

    expect(result).toBeDefined();
    expect(repo.editContact).toHaveBeenCalledTimes(1);

    mockEditContact.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockEditContact = jest
      .spyOn(repo, "editContact")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.mod(contact)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockEditContact.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockEditContact = jest
      .spyOn(repo, "editContact")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.mod(contact)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to Update Contact Record . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to Update Contact Record . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockEditContact.mockClear();
  });
});
