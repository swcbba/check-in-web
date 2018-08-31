import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event } from './event';
import { EventAssistant, AssistantDeleteFlag } from './event-assistant';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private db: AngularFirestore) {}

  getEvent(eventId: string): Observable<Event> {
    return this.db.doc<Event>(`events/${eventId}`).valueChanges();
  }

  getEvents(): Observable<Array<Event>> {
    return this.db
      .collection<Event>('events')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Event;
            const date = data.date as any;
            data.date = new Date(date.seconds * 1000);
            return data;
          })
        )
      );
  }

  getEventAssistants(eventId: string): Observable<Array<EventAssistant>> {
    return this.db
      .collection<EventAssistant>('event-assistants', ref =>
        ref
          .where('eventId', '==', eventId)
          .where('deleteFlag', '==', 0)
          .orderBy('date', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as EventAssistant;
            const date = data.date as any;
            data.date = new Date(date.seconds * 1000);
            return data;
          })
        )
      );
  }

  getEventAssistantsThatMadeCheckIn(
    eventId: string
  ): Observable<Array<string>> {
    return this.db
      .collection<EventAssistant>('event-assistants', ref =>
        ref
          .where('eventId', '==', eventId)
          .where('checkin', '==', true)
          .where('deleteFlag', '==', 0)
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data: EventAssistant = a.payload.doc.data() as EventAssistant;
            const name: string = data.name;
            return name;
          })
        )
      );
  }

  saveEventAssistant(eventAssistant: EventAssistant): void {
    eventAssistant.id = this.db.createId();
    eventAssistant.date = new Date();
    this.setEventAssistant(eventAssistant);
  }

  updateEventAssistant(eventAssistant: EventAssistant): void {
    this.setEventAssistant(eventAssistant);
  }

  softDeleteEventAssistant(eventAssistant: EventAssistant): void {
    eventAssistant.deleteFlag = AssistantDeleteFlag.Yes;
    this.setEventAssistant(eventAssistant);
  }

  private setEventAssistant(eventAssistant: EventAssistant): void {
    this.db
      .collection<EventAssistant>('event-assistants')
      .doc(eventAssistant.id)
      .set(eventAssistant, { merge: true });
  }
}
