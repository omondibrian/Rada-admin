/**
 * @fileOverview contains the various functions to manage university processes.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import TableNames from "../Lib/constants";
import { ICampus } from "@Models/Campus.model";
import { IUniversity } from "@Models/University.model";
import { DataBaseConnection } from "../Lib/db/connection";
import { ICountry } from "../models/Country.model";

export interface IUniversityRepository {
  addUniversity(data: IUniversity): Promise<IUniversity>;
  addCampus(data: ICampus): Promise<ICampus>;
  addFaculty(data: IFaculty): Promise<IFaculty>;
  fetchNoUniversityRegistered(): Promise<number>;
  fetchFaculty(universityId: string): Promise<Array<IFaculty>>;
  fetchCampus(universityId: string): Promise<Array<ICampus>>;
  removeUniversityOrCampus(
    id: string,
    isCampus: boolean
  ): Promise<IUniversity | ICampus>;
  removeFaculty(facultyId: string): Promise<IFaculty>;
}

export interface IFaculty {
  _id?: number;
  name: string;
  University_id: string;
}

export class UniversityRepository implements IUniversityRepository {
  private universityReturnPayload = ["_id", "name", "Country_id"];
  private campusReturnPayload = ["_id", "name", "University_id"];
  private facultyReturnPayload = ["_id", "name", "University_id"];
  private knexConn = new DataBaseConnection().getConnection();

  private universityPayload(result: any): IUniversity {
    return {
      _id: result._id,
      name: result.name,
      country: result.country,
      Country_id: result.Country_id.toString(),
    };
  }

  private campusPayload(result: any): ICampus {
    return {
      _id: result._id,
      name: result.name,
      university: result.university,
      University_id: result.University_id.toString(),
    };
  }
  async fetchNoUniversityRegistered(): Promise<number> {
    const university = await this.knexConn<IUniversity>(
      TableNames.University
    ).count("_id");
    return parseInt(university.pop()!.count.toString())
  }

  private facultyPayload(result: any): IFaculty {
    return {
      _id: result._id,
      name: result.name,
      University_id: result.University_id.toString(),
    };
  }

  async addUniversity(data: IUniversity): Promise<IUniversity> {
    const [result] = await this.knexConn<IUniversity>(
      TableNames.University
    ).insert(data, this.universityReturnPayload);
    const [country] = await this.knexConn<ICountry>(TableNames.Country)
      .select("name")
      .where("_id", "=", result.Country_id);
    result.country = country.name;
    return this.universityPayload(result);
  }

  async addCampus(data: ICampus): Promise<ICampus> {
    const [result] = await this.knexConn<ICampus>(TableNames.Campuses).insert(
      data,
      this.campusReturnPayload
    );
    const [university] = await this.knexConn<IUniversity>(TableNames.University)
      .select("name")
      .where("_id", "=", result.University_id.toString());
    result.university = university.name;
    return this.campusPayload(result);
  }

  async addFaculty(data: IFaculty): Promise<IFaculty> {
    const [result] = await this.knexConn<IFaculty>(TableNames.faculties).insert(
      data,
      this.facultyReturnPayload
    );
    return this.facultyPayload(result);
  }

  async fetchFaculty(universityId: string): Promise<IFaculty[]> {
    const faculties = await this.knexConn<IFaculty>(TableNames.faculties)
      .select(...this.facultyReturnPayload)
      .where("University_id", "=", universityId);
    return faculties.map((faculty) => this.facultyPayload(faculty));
  }
  async fetchCampus(universityId: string): Promise<ICampus[]> {
    const campuses = await this.knexConn<ICampus>(TableNames.Campuses)
      .select(...this.campusReturnPayload)
      .where("University_id", "=", universityId);
    return campuses.map((faculty) => this.campusPayload(faculty));
  }
  async removeFaculty(facultyId: string): Promise<IFaculty> {
    const [faculty] = await this.knexConn<IFaculty>(TableNames.faculties)
      .where("_id", "=", facultyId)
      .returning(this.campusReturnPayload)
      .delete(this.facultyReturnPayload);
    return this.facultyPayload(faculty);
  }
  async removeUniversityOrCampus(
    id: string,
    isCampus: boolean
  ): Promise<IUniversity | ICampus> {
    if (isCampus) {
      const [campus] = await this.knexConn<ICampus>(TableNames.Campuses)
        .where("_id", "=", id)
        .returning(this.campusReturnPayload)
        .delete(this.campusReturnPayload);
      return this.campusPayload(campus);
    } else {
      const [univeristy] = await this.knexConn<IUniversity>(
        TableNames.University
      )
        .where("_id", "=", id)
        .returning(this.campusReturnPayload)
        .delete(this.universityReturnPayload);
      return this.universityPayload(univeristy);
    }
  }
}
