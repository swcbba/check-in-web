export interface IVolunteer {
  id: string;
  name: string;
  email: string;
  cellphone: number;
  team: string;
  deleteFlag: VolunteerDeleteFlag;
  pictureURL?: string;
  attendedToMeeting?: boolean;
}

export enum VolunteerDeleteFlag {
  No = 0,
  Yes = 1
}
