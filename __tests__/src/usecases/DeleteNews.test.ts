import { MockNews } from "@Rada/__mocks__/News";
import { Inews } from "@Repositories/news.repository";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { DeleteNews } from "@Rada/src/usecases/DeleteNews";

describe("Delete News - Usecase", () => {
  const repo = new MockNews();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new DeleteNews(repo, config);
  const news: Inews = {
    Admin_Users_id: "1",
    NewsCategories_id: "1",
    title: "title",
    content: "Quont",
    image: "/",
    status: "1",
    University_id: "1",
  };
  const newsId = "1";
  it("should successfully remove News Record", async () => {
    const mockRemove = jest.spyOn(repo, "deleteNews").mockResolvedValue(news);

    const result = await usecase.remove(newsId);

    expect(result).toBeDefined();
    expect(repo.deleteNews).toHaveBeenCalledTimes(1);

    mockRemove.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockRemove = jest.spyOn(repo, "deleteNews").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(newsId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRemove.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockRemove = jest.spyOn(repo, "deleteNews").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(newsId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to remove Record . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to remove Record . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRemove.mockClear();
  });
});
