import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { AddFaculty } from "@Rada/src/usecases/AddFaculty";
import { IFaculty } from "@Repositories/University.repository";
import { MockedUniversityRepository } from "@Rada/__mocks__/university";

describe("Add new Faculty- Usecase", () => {
  const repo = new MockedUniversityRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new AddFaculty(repo, config);
  const faculty: IFaculty = {
    name: "test faculty",
    University_id: "1",
  };
  it("should successfully add the new faculty for a particular institution", async () => {
    const mockAddFaculty = jest
      .spyOn(repo, "addFaculty")
      .mockResolvedValue(faculty);
    const result = await usecase.add(faculty);
    expect(result).toBeDefined();
    expect(repo.addFaculty).toHaveBeenCalledTimes(1);
    mockAddFaculty.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddFaculty = jest
      .spyOn(repo, "addFaculty")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.add(faculty)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddFaculty.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockAddFaculty = jest
      .spyOn(repo, "addFaculty")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.add(faculty)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to add new faculty . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to add new faculty . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddFaculty.mockClear();
  });
});
