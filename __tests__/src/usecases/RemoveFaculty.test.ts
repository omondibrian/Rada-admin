import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { MockedUniversityRepository } from "@Rada/__mocks__/university";
import { IFaculty } from "@Rada/src/Repositories/University.repository";
import { RemoveFaculty } from "@Rada/src/usecases/RemoveFaculty";

describe("Remove Faculty - Usecase", () => {
  const repo = new MockedUniversityRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new RemoveFaculty(repo, config);
  const facultyId = "1";
  const faculty: IFaculty = {
    name: "test faculty",
    University_id: "1",
  };
 
  it("should successfully remove the specified faculty ", async () => {
    const mockRemove = jest
      .spyOn(repo, "removeFaculty")
      .mockResolvedValue(faculty);
    const result = await usecase.remove(facultyId);
    expect(result).toBeDefined();
    expect(repo.removeFaculty).toHaveBeenCalledTimes(1);
    mockRemove.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockRemove = jest
      .spyOn(repo, "removeFaculty")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.remove(facultyId)) as ResultPayload<Error>;

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
      .spyOn(repo, "removeFaculty")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.remove(facultyId)) as ResultPayload<Error>;

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
