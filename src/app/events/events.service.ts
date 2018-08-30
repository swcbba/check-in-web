import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IEvent } from './i-event';
import { IEventAssistant, AssistantDeleteFlag } from './i-event-assistant';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private db: AngularFirestore) {}

  getEvent(eventId: string): Observable<IEvent> {
    return this.db.doc<IEvent>(`events/${eventId}`).valueChanges();
  }

  getEvents(): Observable<Array<IEvent>> {
    return this.db
      .collection<IEvent>('events')
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as IEvent;
            const date = data.date as any;
            data.date = new Date(date.seconds * 1000);
            return data;
          })
        )
      );
  }

  getEventAssistants(eventId: string): Observable<Array<IEventAssistant>> {
    return this.db
      .collection<IEventAssistant>('event-assistants', ref =>
        ref.where('eventId', '==', eventId).where('deleteFlag', '==', 0)
      )
      .valueChanges();
  }

  saveEventAssistant(eventAssistant: IEventAssistant): void {
    eventAssistant.id = this.db.createId();
    this.setEventAssistant(eventAssistant);
  }

  updateEventAssistant(eventAssistant: IEventAssistant): void {
    this.setEventAssistant(eventAssistant);
  }

  softDeleteEventAssistant(eventAssistant: IEventAssistant): void {
    eventAssistant.deleteFlag = AssistantDeleteFlag.Yes;
    this.setEventAssistant(eventAssistant);
  }

  private setEventAssistant(eventAssistant: IEventAssistant): void {
    this.db
      .collection<IEventAssistant>('event-assistants')
      .doc(eventAssistant.id)
      .set(eventAssistant, { merge: true });
  }
}
