import { IStudent } from "@Models/Student.model";
import { ResultPayload } from "@Rada/src/Lib/utils/result";
import { UserMockRepository } from "@Rada/__mocks__/UserRepository";
import { AddStudentDetails } from "@Rada/src/usecases/AddStudentDetails";

describe("Add new Student - Usecase", () => {
  const repo = new UserMockRepository();
  const config = jest.fn().mockReturnValue({ env: "development" });
  const usecase = new AddStudentDetails(repo, config);
  const student: IStudent = {
    User_id: 1,
    regNo: "1",
    Campuses_id: 1,
  };
  it("should successfully add the new user as a student", async () => {
    const mockAddStudentDetails = jest
      .spyOn(repo, "addStudentDetails")
      .mockResolvedValue(true);
    const result = await usecase.add(student);
    expect(result).toBeDefined();
    expect(repo.addStudentDetails).toHaveBeenCalledTimes(1);
    mockAddStudentDetails.mockClear();
  });
  it("should return resultPayload with an error incase of an exception -inDevMode", async () => {
    const mockAddStudentDetails = jest
      .spyOn(repo, "addStudentDetails")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "development" });
    const result = (await usecase.add(student)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Error will Testing"),
      500
    );
    expect(result?.getError()?.message).toBe("Error will Testing");
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddStudentDetails.mockClear();
  });

  it("should return resultPayload with an error incase of an exception -inProductionMode", async () => {
    const mockAddStudentDetails = jest
      .spyOn(repo, "addStudentDetails")
      .mockImplementation(() => {
        throw new Error("Error will Testing");
      });
    config.mockReturnValue({ env: "production" });
    const result = (await usecase.add(student)) as ResultPayload<Error>;

    const expectedSimulatedResults = new ResultPayload<Error>(
      new Error("Unable to add new Student.Please retry"),
      500
    );
    expect(result?.getError()?.message).toBe(
      "Unable to add new Student.Please retry"
    );
    expect(result).toStrictEqual<ResultPayload<Error>>(
      expectedSimulatedResults
    );
    mockAddStudentDetails.mockClear();
  });
});
