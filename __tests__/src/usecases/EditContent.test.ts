import { MockContent } from "@Rada/__mocks__/content";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IContent } from "@Rada/src/Repositories/content.repository";
import { EditContent } from "@Rada/src/usecases/EditContent";

describe("Edit Content - Usecase", () => {
  const repo = new MockContent();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new EditContent(repo, config);
  const content: IContent = {
    Admin_Users_id: "1",
    content: "content",
    path: "/",
    Data_types_id: "type",
    Sub_Categories_id: "category",
    University_id: "1",
  };
  const contentId = "1";
  it("should successfully edit the specified content", async () => {
    const mockEditContent = jest
      .spyOn(repo, "EditContent")
      .mockResolvedValue(content);

    const result = await usecase.mod(contentId,content);

    expect(result).toBeDefined();
    expect(repo.EditContent).toHaveBeenCalledTimes(1);

    mockEditContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockEditContent = jest
      .spyOn(repo, "EditContent")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.mod(contentId,content)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockEditContent.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockEditContent = jest
      .spyOn(repo, "EditContent")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.mod(contentId,content)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to update Record . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to update Record . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockEditContent.mockClear();
  });
});
