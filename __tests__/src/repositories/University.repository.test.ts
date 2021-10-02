import { config } from "dotenv";
import { IUniversity } from "@Models/University.model";
import {
  IFaculty,
  UniversityRepository,
} from "@Repositories/University.repository";
import { ICampus } from "@Rada/src/models/Campus.model";
config();

describe("University Repository ", () => {
  const repository = new UniversityRepository();
  const testUniData: IUniversity = {
    name: "Test Univerity",
    Country_id: "1",
  };
  let uniId = 0;
  let campusId = 0;
  let fId = 0;
  describe("University Repository - addUniversity", () => {
    it("should successfully add new univerity data", async () => {
      const result = await repository.addUniversity(testUniData);
      uniId = result._id as number;
      expect(result.name).toEqual(testUniData.name);
      expect(result.Country_id).toEqual(testUniData.Country_id);
      expect(result.country).toEqual("KENYA");
    });
  });

  describe("Univerity Repository - addCampus", () => {
    it("should successfully add new campus for a particular univerity", async () => {
      
      const campus: ICampus = {
        name: "testCampus",
        University_id: uniId.toString(),
      };
      const result = await repository.addCampus(campus);
      campusId = result._id as number;
      expect(result.name).toEqual(campus.name);
      expect(result.university).toEqual(testUniData.name);
      expect(result.University_id).toEqual(campus.University_id);
    });
  });

  describe("University Repository - addFaculty", () => {
    it("should add new faculty to a particular university", async () => {
      const faculty: IFaculty = {
        name: "Science",
        University_id: uniId.toString(),
      };
      const result = await repository.addFaculty(faculty);
      fId = result._id as number;
      expect(result.name).toEqual(faculty.name);
      expect(result.University_id).toEqual(faculty.University_id);
    });
  });
  describe("University Repository - fetchUniversity", () => {
    it("should retrive the university details requested", async () => {
      const university = await repository.fetchUniversity(testUniData.name);
      expect(university.name).toEqual(testUniData.name);
    });
  });

  describe("University Repository - fetchCampus", () => {
    it("should fetch all the available campuses for particular university", async () => {
      const campuses = await repository.fetchCampus(uniId + "");
      expect(campuses.length).toBeGreaterThan(0);
    });
  });

  describe("University Repository - fetchFaculty", () => {
    it("should retrive all available faculties for the requested institution", async () => {
      const faculty = await repository.fetchFaculty(uniId.toString());
      expect(faculty.length).toBeGreaterThan(0);
    });
  });
  describe('University Repository - fetchNoUniversityRegistered', () => {
    it('should return the number of registered institutions',async()=>{
      const result = await repository.fetchNoUniversityRegistered();
      expect(result).toBeGreaterThan(0);
    })
  })

  describe("University Repository - fetchCampusByName", () => {
    const campus: ICampus = {
      name: "testCampus",
      University_id: uniId.toString(),
    };
    it("should retrive the requested campus details", async () => {
      const result = await repository.fetchCampusByName(campus.name);
      expect(result.name).toEqual(campus.name);
    });
  });
  
  describe("Univerity Repository - removeFaculty", () => {
    it("should remove the specified faculty", async () => {
      const deletedFaculty = await repository.removeFaculty(fId.toString());
      expect(deletedFaculty._id).toEqual(fId);
    });
  });

  describe("University Repository - removeUniversityOrCampus", () => {
    it("should remove the specified campus", async () => {
      const campus = await repository.removeUniversityOrCampus(
        campusId.toString(),
        true
      );
      expect(campus._id).toEqual(campusId);
    });
    it("should remove the specified university based on the id", async () => {
      const university = await repository.removeUniversityOrCampus(
        uniId.toString(),
        false
      );
      expect(university._id).toEqual(uniId);
    });
  });
});
