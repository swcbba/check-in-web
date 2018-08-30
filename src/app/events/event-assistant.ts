export interface EventAssistant {
  id: string;
  name: string;
  checkin: boolean;
  date: Date;
  deleteFlag: AssistantDeleteFlag;
  email?: string;
  phoneNumber?: number;
  event?: string;
  eventId?: string;
  ticketNumber?: string;
  drink?: string;
}

export enum AssistantDeleteFlag {
  No = 0,
  Yes = 1
}
