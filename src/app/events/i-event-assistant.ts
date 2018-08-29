export interface IEventAssistant {
  id: string;
  name: string;
  checkin: boolean;
  email?: string;
  phoneNumber?: number;
  event?: string;
  eventId?: string;
  ticketNumber?: string;
}
