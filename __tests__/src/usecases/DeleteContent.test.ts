import { MockContent } from "@Rada/__mocks__/content";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IContent } from "@Rada/src/Repositories/content.repository";
import { DeleteContent } from "@Rada/src/usecases/DeleteContent";

describe("Delete Content - Usecase", () => {
  const repo = new MockContent();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new DeleteContent(repo, config);
  const content: IContent = {
    Admin_Users_id: "1",
    content: "content",
    path: "/",
    Data_types_id: "type",
    Sub_Categories_id: "category",
    University_id: "1",
  };
  const contentId = "1";
  it("should successfully delete the specified content", async () => {
    const mockDeleteContent = jest
      .spyOn(repo, "DeleteContent")
      .mockResolvedValue(content);

    const result = await usecase.remove(contentId);

    expect(result).toBeDefined();
    expect(repo.DeleteContent).toHaveBeenCalledTimes(1);

    mockDeleteContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockDeleteContent = jest
      .spyOn(repo, "DeleteContent")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(contentId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockDeleteContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockDeleteContent = jest
      .spyOn(repo, "DeleteContent")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(contentId)) as ResultPayload<Error>;

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
    mockDeleteContent.mockClear();
  });
});
