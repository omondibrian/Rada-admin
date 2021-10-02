/* istanbul ignore file */
import { AddCampus } from "../usecases/AddCampus";
import { AddFaculty } from "../usecases/AddFaculty";
import { FetchCampus } from "../usecases/FetchCampus";
import { RemoveFaculty } from "../usecases/RemoveFaculty";
import { AddInstitution } from "../usecases/AddUniversity";
import { FetchUniversity } from "../usecases/FetchUniversity";
import { FetchSingleCampus } from "../usecases/FetchSingleCampus";
import { UniversityRepository } from "@Repositories/University.repository";
import { RemoveUniversityOrCampus } from "../usecases/RemoveUniversityOrCampus";

export class UniversityServiceProvider {
  private readonly repo = new UniversityRepository();
  private config() {
    return {
      env: process.env.NODE_ENV,
      multiTenantMode: process.env.MODE === "true" ? true : false,
    };
  }

  addUniversity = new AddInstitution(this.repo, this.config);
  addCampus = new AddCampus(this.repo, this.config);
  addFaculty = new AddFaculty(this.repo, this.config);

  fetchCampus = new FetchCampus(this.repo, this.config);
  fetchCampusByName = new FetchSingleCampus(this.repo, this.config);
  //   fetchFaculty = new Fetch
  fetchUniversity = new FetchUniversity(this.repo, this.config);
  removeFaculty = new RemoveFaculty(this.repo, this.config);
  removeCampusOrUniversity = new RemoveUniversityOrCampus(
    this.repo,
    this.config
  );
}
