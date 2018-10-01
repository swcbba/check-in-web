import { Voucher } from './voucher';

export interface Event {
  id: string;
  name: string;
  place: string;
  date: Date;
  vouchers?: Array<Voucher>;
  pictureURL?: string;
}
