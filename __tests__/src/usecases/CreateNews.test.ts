import { MockNews } from "@Rada/__mocks__/News";
import { Inews } from "@Repositories/news.repository";
import { CreateNews } from "@Rada/src/usecases/CreateNews";
import { ResultPayload } from "@Rada/src/Lib/utils/result";

describe("Create News - Usecase", () => {
  const repo = new MockNews();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new CreateNews(repo, config);
  const news: Inews = {
    Admin_Users_id: "1",
    NewsCategories_id: "1",
    title: "title",
    content: "Quont",
    image: "/",
    status: "1",
    University_id: "1",
  };
  it("should successfully create new News Record", async () => {
    const mockcreateNews = jest
      .spyOn(repo, "createNews")
      .mockResolvedValue(news);

    const result = await usecase.create(news);

    expect(result).toBeDefined();
    expect(repo.createNews).toHaveBeenCalledTimes(1);

    mockcreateNews.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockcreateNews = jest
      .spyOn(repo, "createNews")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.create(news)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockcreateNews.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockcreateNews = jest
      .spyOn(repo, "createNews")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.create(news)) as ResultPayload<Error>;

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
    mockcreateNews.mockClear();
  });
});
