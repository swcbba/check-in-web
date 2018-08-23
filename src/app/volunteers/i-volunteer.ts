export interface IVolunteer {
  id: string;
  name: string;
  email: string;
  cellphone: number;
  team: string;
  deleteFlag: VolunteerDeleteFlag;
  pictureURL?: string;
}

export enum VolunteerDeleteFlag {
  No = 0,
  Yes = 1
}
