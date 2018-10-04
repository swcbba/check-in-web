export interface EventAssistant {
  id: string;
  eventId: string;
  event: string;
  name: string;
  checkin: boolean;
  date: Date;
  deleteFlag: AssistantDeleteFlag;
  email?: string;
  phoneNumber?: number;
  ticketNumber?: string;
  vouchers?: Array<string>;
}

export enum AssistantDeleteFlag {
  No = 0,
  Yes = 1
}
