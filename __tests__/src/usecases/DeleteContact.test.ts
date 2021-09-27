import { MockContact } from "@Rada/__mocks__/contact";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IContact } from "@Repositories/contact.repository";
import { DeleteContact } from "@Rada/src/usecases/DeleteContact";

describe("Delete Contact - Usecase", () => {
  const repo = new MockContact();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new DeleteContact(repo, config);

  const contactId = 1;
  const contact: IContact = {
    name: "test",
    email: "test@site.com",
    phone: "+254123456789",
    Campuses_id: "1",
    University_id: "1",
    _id: contactId,
  };
  it("should successfully delete the specified contact", async () => {
    const mockDeleteContact = jest
      .spyOn(repo, "deleteContact")
      .mockResolvedValue(contact);

    const result = await usecase.remove(contactId.toString());

    expect(result).toBeDefined();
    expect(repo.deleteContact).toHaveBeenCalledTimes(1);

    mockDeleteContact.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockDeleteContact = jest
      .spyOn(repo, "deleteContact")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(contactId.toString())) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockDeleteContact.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockDeleteContact = jest
      .spyOn(repo, "deleteContact")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(contactId.toString())) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to remove Contact Record . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to remove Contact Record . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockDeleteContact.mockClear();
  });
});
