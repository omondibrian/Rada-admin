import User, { IUser } from "../models/User.model";


export interface IUserRepository {
  insert(data: IUser): Promise<User>;
  update(
    options: { field: string; value: string },
    data: IUser
  ): Promise<User>;
  find(data: { field: string; value: string }): Promise<User|undefined>;
  findById(id: string): Promise<User|undefined>;
  Delete(id: string): Promise<User>;
  addAdmin(userID:string,roleID:string):Promise<boolean>;

}
export default class UserRepository implements IUserRepository {

  public insert =  async (data: IUser): Promise<User|any> => {
      console.log(data)
    const result = await User.query().insert(data);
    return result;
  }
  public async update(
    options: { field: string; value: string },
    data: IUser
  ): Promise<User> {
    await User.query().patch(data).where(options.field, "=", options.value);
    const result = await User.query()
      .select("*")
      .where(options.field, "=", options.value);
    return result[0];
  }
  public async find(data: { field: string; value: string }): Promise<User|undefined> {
    const result = await User.query()
      .select("*")
      .where(data.field, "=", data.value);
    return result[0];
  }
  public async findById(id: string): Promise<User |undefined> {
    const user = await User.query().findById(id);
    return user;
  }
  public async Delete(id: string): Promise<User> {
    const deletedUser = await this.findById(id) as User;
    await User.query().deleteById(id);
    return deletedUser;
  }
  addAdmin(userID: string, roleID: string): Promise<boolean> {
    throw new Error("Method not implemented.");
}

}

