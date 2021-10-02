import { MockRole } from "@Rada/__mocks__/roles";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { IAdminUser } from '@Rada/src/models/AdminUser.model';
import { AssignUserRole } from '../../../src/usecases/AssignUserRole';

describe("Assign user an Administartive role - Usecase", () => {
  const repo = new MockRole();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new AssignUserRole(repo, config);
  const admin: IAdminUser = {
    User_id: "1",
    Roles_id: "1",
  };
  it("should successfully assign user role", async () => {
    const mockAddRole = jest.spyOn(repo, "assingUserRole").mockResolvedValue(admin);
    const result = await usecase.add(admin);
    expect(result).toBeDefined();
    expect(repo.assingUserRole).toHaveBeenCalledTimes(1);
    mockAddRole.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddRole = jest.spyOn(repo, "assingUserRole").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.add(admin)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddRole.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockAddRole = jest.spyOn(repo, "assingUserRole").mockImplementation(() => {
      throw new Error("Error will Testing");
    });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.add(admin)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to add new admin"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to add new admin"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddRole.mockClear();
  });
});
