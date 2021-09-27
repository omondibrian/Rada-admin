import { MockContact } from "@Rada/__mocks__/contact";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { FetchContacts } from "@Rada/src/usecases/FetchContact";
import { IContact } from "@Rada/src/Repositories/contact.repository";

describe("Fetch Contacts - Usecase", () => {
  const repo = new MockContact();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchContacts(repo, config);
  const contactId = 1;
  const contact: IContact = {
    name: "test",
    email: "test@site.com",
    phone: "+254123456789",
    Campuses_id: "1",
    University_id: "1",
    _id:contactId
  };
  const universityId = "1";
  it("should successfully retrive contacts for a particular institution", async () => {
    const mockFetchContacts = jest
      .spyOn(repo, "fechContacts")
      .mockResolvedValue([contact]);

    const result = await usecase.fetch(universityId);

    expect(result).toBeDefined();
    expect(repo.fechContacts).toHaveBeenCalledTimes(1);

    mockFetchContacts.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchContacts = jest
      .spyOn(repo, "fechContacts")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch(universityId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchContacts.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchContacts = jest
      .spyOn(repo, "fechContacts")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(universityId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive contact Records . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive contact Records . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchContacts.mockClear();
  });
});
