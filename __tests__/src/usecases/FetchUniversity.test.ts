import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { FetchUniversity } from "@Rada/src/usecases/FetchUniversity";
import { MockedUniversityRepository } from "@Rada/__mocks__/university";
import { IUniversity } from "@Rada/src/models/University.model";

describe("FetchUniversity - Usecase", () => {
  const repo = new MockedUniversityRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchUniversity(repo, config);
  const university: IUniversity = {
    name: "test University",
   Country_id:'1'
  };
  it("should successfully fetch all university details", async () => {
    const mockFetchUniversity = jest
      .spyOn(repo, "fetchUniversity")
      .mockResolvedValue({
        name: "test University",
        _id:'1'  
      });

    const result = await usecase.fetch(university.name);

    expect(result).toBeDefined();
    expect(repo.fetchUniversity).toHaveBeenCalledTimes(1);

    mockFetchUniversity.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockFetchUniversity = jest
      .spyOn(repo, "fetchUniversity")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch(university.name)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchUniversity.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockFetchUniversity = jest
      .spyOn(repo, "fetchUniversity")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(university.name)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to retrive the requested institution. Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to retrive the requested institution. Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockFetchUniversity.mockClear();
  });
});
