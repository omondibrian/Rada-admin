import { MockContent } from "@Rada/__mocks__/content";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IContent } from "@Rada/src/Repositories/content.repository";
import { FetchContents } from "@Rada/src/usecases/FetchContents";

describe("Fetch Contents - Usecase", () => {
  const repo = new MockContent();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchContents(repo, config);
  const content: IContent = {
    Admin_Users_id: "1",
    content: "content",
    path: "/",
    Data_types_id: "type",
    Sub_Categories_id: "category",
    University_id: "1",
  };
  const universityId = "1";
  it("should successfully retrive content for a particular institution", async () => {
    const mockFetchContent = jest
      .spyOn(repo, "fetchContents")
      .mockResolvedValue([content]);

    const result = await usecase.fetch(universityId);

    expect(result).toBeDefined();
    expect(repo.fetchContents).toHaveBeenCalledTimes(1);

    mockFetchContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchContent = jest
      .spyOn(repo, "fetchContents")
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
    mockFetchContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchContent = jest
      .spyOn(repo, "fetchContents")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(universityId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive Records . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive Records . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchContent.mockClear();
  });
});
