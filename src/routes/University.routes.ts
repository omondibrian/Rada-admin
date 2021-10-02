import { isAdmin, TokenMiddleware } from "./../Lib/middleware";
import { Router } from "express";
import { UniversityServiceProvider } from "../service/University.service";
import {
  campusOrFacultyRegistration,
  campusOrUniDeletion,
  universityRegistration,
} from "../Lib/middleware";

const universityRoutes = Router();
const universityService = new UniversityServiceProvider();

universityRoutes.get(
  "/campus",
  TokenMiddleware,
  async (req: any, res, next) => {
    try {
      const campuses = await universityService.fetchCampus.fetch(
        req.universityId
      );
      res.status(campuses?.status as number).json({
        campuses: campuses!.getResult().payload,
        message: campuses!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

universityRoutes.post(
  "/",
  universityRegistration,
  async (req: any, res, next) => {
    try {
      const university = await universityService.addUniversity.add(req.body);
      res.status(university?.status as number).json({
        university: university!.getResult().payload,
        message: university!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

universityRoutes.post(
  "/campus",
  campusOrFacultyRegistration,
  async (req: any, res, next) => {
    try {
      const campus = await universityService.addCampus.add(req.body);
      res.status(campus?.status as number).json({
        campus: campus!.getResult().payload,
        message: campus!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

universityRoutes.post(
  "/faculty",
  campusOrFacultyRegistration,
  async (req: any, res, next) => {
    try {
      const faculty = await universityService.addFaculty.add(req.body);
      res.status(faculty?.status as number).json({
        faculty: faculty!.getResult().payload,
        message: faculty!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

universityRoutes.delete("/faculty/:id", async (req: any, res, next) => {
  try {
    const faculty = await universityService.removeFaculty.remove(req.params.id);
    res.status(faculty?.status as number).json({
      faculty: faculty!.getResult().payload,
      message: faculty!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

universityRoutes.delete(
  "/",isAdmin,
  campusOrUniDeletion,
  async (req: any, res, next) => {
    try {
      const payload = await universityService.removeCampusOrUniversity.remove(
        req.body.id,
        req.body.isCampus
      );
      res.status(payload?.status as number).json({
        payload: payload!.getResult().payload,
        message: payload!.getResult().message,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default universityRoutes;
