import { Router } from "express";
import { locationMiddleware } from "../Lib/middleware";
import { LocationService } from "../service/Location.service";

const locationRoutes = Router();
const locationService = new LocationService();

locationRoutes.get("/", async (req: any, res, next) => {
  try {
    const locations = await locationService.fetchLocations.fetch(
      req.universityId
    );
    res.status(locations?.status as number).json({
      locations: locations!.getResult().payload,
      message: locations!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

locationRoutes.post("/", locationMiddleware, async (req: any, res, next) => {
  try {
    const locations = await locationService.addLocation.add({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      University_id: req.universityId,
      Campuses_id: req.body.campus_id,
    });
    res.status(locations?.status as number).json({
      locations: locations!.getResult().payload,
      message: locations!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

locationRoutes.delete("/:id", async (req: any, res, next) => {
  try {
    const locations = await locationService.deleteLocation.remove(
      req.params.id
    );
    res.status(locations?.status as number).json({
      locations: locations!.getResult().payload,
      message: locations!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

export default locationRoutes;
