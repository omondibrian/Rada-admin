import { ILocation, ILocationRepository } from "@Rada/src/Repositories/location.repository";

export class MockLocation implements ILocationRepository{
    addLocation(location: ILocation): Promise<ILocation> {
        throw new Error("Method not implemented.");
    }
    fetchLocation(universityId: string): Promise<ILocation[]> {
        throw new Error("Method not implemented.");
    }
    removeLocation(id: string): Promise<ILocation> {
        throw new Error("Method not implemented.");
    }
}