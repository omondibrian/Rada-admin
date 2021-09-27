import { ICampus } from "@Models/Campus.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IUniversity } from "@Rada/src/models/University.model";
import { MockedUniversityRepository } from "@Rada/__mocks__/university";
import { RemoveUniversityOrCampus } from "@Rada/src/usecases/RemoveUniversityOrCampus";

describe("Remove University or Campus - Usecase", () => {
  const repo = new MockedUniversityRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new RemoveUniversityOrCampus(repo, config);
  const universityId = "1";
  const campusId = "1";
  const campus: ICampus = {
    name: "test campus",
    University_id: "1",
  };
  const university: IUniversity = {
    Country_id: "1",
    name: "Test Institution",
    country: "KENYA",
  };
  it("should successfully remove the specified campus ", async () => {
    const mockRemove = jest
      .spyOn(repo, "removeUniversityOrCampus")
      .mockResolvedValue(campus);
    const result = await usecase.remove(campusId, true);
    expect(result).toBeDefined();
    expect(repo.removeUniversityOrCampus).toHaveBeenCalledTimes(1);
    mockRemove.mockClear();
  });
  it("should successfully remove the specified university ", async () => {
    const mockRemove = jest
      .spyOn(repo, "removeUniversityOrCampus")
      .mockResolvedValue(university);
    const result = await usecase.remove(universityId, false);
    expect(result).toBeDefined();
    expect(repo.removeUniversityOrCampus).toHaveBeenCalledTimes(1);
    mockRemove.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockRemove = jest
      .spyOn(repo, "removeUniversityOrCampus")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(
      universityId,
      false
    )) as ResultPayload<Error>;

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
    const mockRemove = jest
      .spyOn(repo, "removeUniversityOrCampus")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(
      universityId,
      false
    )) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to remove record . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to remove record . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockRemove.mockClear();
  });
});
