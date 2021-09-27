import { MockContent } from "@Rada/__mocks__/content";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { CreateContent } from "@Rada/src/usecases/CreateContent";
import { IContent } from "@Rada/src/Repositories/content.repository";

describe("Create Content - Usecase", () => {
  const repo = new MockContent();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new CreateContent(repo, config);
  const content: IContent = {
    Admin_Users_id: "1",
    content: "content",
    path: "/",
    Data_types_id: "type",
    Sub_Categories_id: "category",
    University_id:'1'
  };
  it("should successfully create new content", async () => {
    const mockCreateContent = jest
      .spyOn(repo, "createContent")
      .mockResolvedValue(content);

    const result = await usecase.create(content);

    expect(result).toBeDefined();
    expect(repo.createContent).toHaveBeenCalledTimes(1);

    mockCreateContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockCreateContent = jest
      .spyOn(repo, "createContent")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.create(content)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockCreateContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockCreateContent = jest
      .spyOn(repo, "createContent")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.create(content)) as ResultPayload<Error>;

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
    mockCreateContent.mockClear();
  });
});
