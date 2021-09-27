import { ICampus } from "@Models/Campus.model";
import { AddCampus } from "@Rada/src/usecases/AddCampus";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { MockedUniversityRepository } from '@Rada/__mocks__/university';


describe("Add new campus- Usecase", () => {
  const repo = new MockedUniversityRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new AddCampus(repo, config);
  const campus: ICampus = {
    name: "test campus",
    University_id: "1",
  };
  it("should successfully add the new campus for a particular institution", async () => {
    const mockAddCampus = jest.spyOn(repo, "addCampus").mockResolvedValue(campus);
    const result = await usecase.add(campus);
    expect(result).toBeDefined();
    expect(repo.addCampus).toHaveBeenCalledTimes(1);
    mockAddCampus.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddCampus = jest.spyOn(repo, "addCampus").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.add(campus)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddCampus.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockAddCampus = jest.spyOn(repo, "addCampus").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.add(campus)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to add new campus . Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to add new campus . Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddCampus.mockClear();
  });
});
