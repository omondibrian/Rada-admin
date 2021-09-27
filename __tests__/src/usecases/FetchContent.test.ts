import { MockContent } from "@Rada/__mocks__/content";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { FetchContent } from "@Rada/src/usecases/FetchContent";
import { IContent } from "@Rada/src/Repositories/content.repository";

describe("Fetch Content - Usecase", () => {
  const repo = new MockContent();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchContent(repo, config);
  const content: IContent = {
    Admin_Users_id: "1",
    content: "content",
    path: "/",
    Data_types_id: "type",
    Sub_Categories_id: "category",
    University_id: "1",
  };
  const contentId = "1";
  it("should successfully retrive the specified content", async () => {
    const mockFetchContent = jest
      .spyOn(repo, "fetchContent")
      .mockResolvedValue(content);

    const result = await usecase.fetch(contentId);

    expect(result).toBeDefined();
    expect(repo.fetchContent).toHaveBeenCalledTimes(1);

    mockFetchContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchContent = jest
      .spyOn(repo, "fetchContent")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch(contentId)) as ResultPayload<Error>;

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
      .spyOn(repo, "fetchContent")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(contentId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive Record . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive Record . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchContent.mockClear();
  });
});
