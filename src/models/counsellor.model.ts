export interface ICounsellor {
  expertise: string;
  Campuses_id: number;
  User_id: number;
  total_rating?:number;
  total_No_user_rated?:number;
  Schedule: Array<ISchedule>;
}

export interface ISchedule {
  day: string;
  active: {
    from: string;
    to: string;
  };
}
