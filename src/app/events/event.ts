export interface Event {
  id: string;
  name: string;
  place: string;
  date: Date;
  voucherOptions?: Array<string>;
  pictureURL?: string;
}
