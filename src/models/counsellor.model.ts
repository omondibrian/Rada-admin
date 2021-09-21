export interface ICounsellor {
  expertise: string;
  Campuses_id: number;
  User_id: number;
  Schedule: Array<ISchedule>;
}

export interface ISchedule {
  day: string;
  active: {
    from: string;
    to: string;
  };
}
