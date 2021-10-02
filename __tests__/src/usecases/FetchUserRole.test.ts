import { MockRole } from "@Rada/__mocks__/roles";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { FetchUserRole } from "@Rada/src/usecases/FetchUserRole";

describe("Fetch user role - Usecase", () => {
  const repo = new MockRole();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new FetchUserRole(repo, config);
  const userRole = {
    id: "1",
    name: "test Role",
  };
  const userId = "1";
  it("should successfully fetch user role", async () => {
    const mockAddRole = jest
      .spyOn(repo, "fetchUserRole")
      .mockResolvedValue([userRole]);
    const result = await usecase.fetch(userId);
    expect(result).toBeDefined();
    expect(repo.fetchUserRole).toHaveBeenCalledTimes(1);
    mockAddRole.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddRole = jest
      .spyOn(repo, "fetchUserRole")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.fetch(userId)) as ResultPayload<Error>;

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
    const mockAddRole = jest
      .spyOn(repo, "fetchUserRole")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.fetch(userId)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error(
        "Unable to fetch user role or user has insufficient permissions"
      ),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to fetch user role or user has insufficient permissions"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddRole.mockClear();
  });
});
