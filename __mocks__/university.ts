import { ICampus } from "@Rada/src/models/Campus.model";
import { IUniversity } from "@Rada/src/models/University.model";
import { IFaculty, IUniversityRepository } from "@Rada/src/Repositories/University.repository";

export class MockedUniversityRepository implements IUniversityRepository{
    fetchNoUniversityRegistered(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    addUniversity(data: IUniversity): Promise<IUniversity> {
        throw new Error("Method not implemented.");
    }
    addCampus(data: ICampus): Promise<ICampus> {
        throw new Error("Method not implemented.");
    }
    addFaculty(data: IFaculty): Promise<IFaculty> {
        throw new Error("Method not implemented.");
    }
    fetchFaculty(universityId: string): Promise<IFaculty[]> {
        throw new Error("Method not implemented.");
    }
    fetchCampus(universityId: string): Promise<ICampus[]> {
        throw new Error("Method not implemented.");
    }
    removeUniversityOrCampus(id: string, isCampus: boolean): Promise<IUniversity | ICampus> {
        throw new Error("Method not implemented.");
    }
    removeFaculty(facultyId: string): Promise<IFaculty> {
        throw new Error("Method not implemented.");
    }
}