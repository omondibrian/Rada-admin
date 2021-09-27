import { MockContact } from "@Rada/__mocks__/contact";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IContact } from "@Repositories/contact.repository";
import { CreateContact } from "@Rada/src/usecases/CreateContact";

describe("Create Contact - Usecase", () => {
  const repo = new MockContact();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new CreateContact(repo, config);
  const contact: IContact = {
    name: "test",
    email: "test@site.com",
    phone: "+254123456789",
    Campuses_id: "1",
    University_id: "1",
  };
  it("should successfully create new contact", async () => {
    const mockCreateContact = jest
      .spyOn(repo, "createContact")
      .mockResolvedValue(contact);

    const result = await usecase.create(contact);

    expect(result).toBeDefined();
    expect(repo.createContact).toHaveBeenCalledTimes(1);

    mockCreateContact.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockCreateContact = jest
      .spyOn(repo, "createContact")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.create(contact)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockCreateContact.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockCreateContact = jest
      .spyOn(repo, "createContact")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.create(contact)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to create Record . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to create Record . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockCreateContact.mockClear();
  });
});
