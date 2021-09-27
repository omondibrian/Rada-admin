import { MockNews } from "@Rada/__mocks__/News";
import { Inews } from "@Repositories/news.repository";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { FetchNews } from "@Rada/src/usecases/FetchNews";

describe("Fetch News - Usecase", () => {
  const repo = new MockNews();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchNews(repo, config);
  const news: Inews = {
    Admin_Users_id: "1",
    NewsCategories_id: "1",
    title: "title",
    content: "Quont",
    image: "/",
    status: "1",
    University_id:'1'
  };
  const universityId = "1";
  it("should successfully fetch all available News Record", async () => {
    const mockFetchNews = jest
      .spyOn(repo, "fetchNews")
      .mockResolvedValue([news]);

    const result = await usecase.fetch(universityId);

    expect(result).toBeDefined();
    expect(repo.fetchNews).toHaveBeenCalledTimes(1);

    mockFetchNews.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchNews = jest
      .spyOn(repo, "fetchNews")
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
    mockFetchNews.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchNews = jest
      .spyOn(repo, "fetchNews")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(universityId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to fetch news Records . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to fetch news Records . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchNews.mockClear();
  });
});
