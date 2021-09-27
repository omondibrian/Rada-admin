import { IUniversity } from "@Models/University.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { AddInstitution } from "@Rada/src/usecases/AddUniversity";
import { MockedUniversityRepository } from "@Rada/__mocks__/university";

describe("Add new Institution - Usecase", () => {
  const repo = new MockedUniversityRepository();
  const config = jest
    .fn()
    .mockReturnValue({ env: "development", multiTenantMode: true });
  const usecase = new AddInstitution(repo, config);
  const institute: IUniversity = {
    Country_id: "1",
    name: "Test Institution",
    country: "KENYA",
  };

  it("should successfully add the new institution - multiTenantMode", async () => {
    const mockAddInstitution = jest
      .spyOn(repo, "addUniversity")
      .mockResolvedValue(institute);
    const mockInstitutionCount = jest
      .spyOn(repo, "fetchNoUniversityRegistered")
      .mockResolvedValue(0);
    const result = await usecase.add(institute);
    expect(result).toBeDefined();
    expect(repo.addUniversity).toHaveBeenCalledTimes(1);
    mockInstitutionCount.mockClear();
    mockAddInstitution.mockClear();
  });

  it("should successfully add the new institution - singleMode", async () => {
    const mockAddInstitution = jest
      .spyOn(repo, "addUniversity")
      .mockResolvedValue(institute);
    const mockInstitutionCount = jest
      .spyOn(repo, "fetchNoUniversityRegistered")
      .mockResolvedValue(1); //no of registred institutions
    config.mockReturnValue({ env: "development", multiTenantMode: false });
    let result = await usecase.add(institute);
    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Running in single mode"),
      500
    );
    expect(result?.getError()?.message).toBe("Running in single mode");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    expect(repo.addUniversity).toHaveBeenCalledTimes(0);
    
    //testing for no present institution in single mode
    mockInstitutionCount.mockResolvedValue(0)
    result = await usecase.add(institute);
    expect(repo.addUniversity).toHaveBeenCalledTimes(1);

    mockInstitutionCount.mockClear();
    mockAddInstitution.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddInstitution = jest
      .spyOn(repo, "addUniversity")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development", multiTenantMode: true });
    const result = (await usecase.add(institute)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddInstitution.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockAddInstitution = jest
      .spyOn(repo, "addUniversity")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production", multiTenantMode: true });
    const result = (await usecase.add(institute)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error(
        "Unable to add new institution please check that you are currently running in multi-tenant mode"
      ),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to add new institution please check that you are currently running in multi-tenant mode"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddInstitution.mockClear();
  });
});
