import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Meeting } from './meeting';
import { MeetingAssistant } from './meeting-assistant';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {
  constructor(private db: AngularFirestore) {}

  getMeeting(meetingId: string): Observable<Meeting> {
    return this.db.doc<Meeting>(`meetings/${meetingId}`).valueChanges();
  }

  getMeetings(): Observable<Array<Meeting>> {
    return this.db
      .collection<Meeting>('meetings', ref => ref.orderBy('date', 'asc'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Meeting;
            const date = data.date as any;
            data.date = new Date(date.seconds * 1000);
            return data;
          })
        )
      );
  }

  getMeetingAssistantsByMeeting(
    meetingId: string
  ): Observable<Array<MeetingAssistant>> {
    return this.db
      .collection<MeetingAssistant>('meeting-assistant', ref =>
        ref.where('meetingId', '==', meetingId).orderBy('date', 'asc')
      )
      .valueChanges();
  }

  setMeetingAssistant(meetingId: string, volunteerId: string): void {
    const id: string = `${meetingId}_${volunteerId}`;
    const meetingAssistant = {
      meetingId,
      volunteerId,
      date: new Date()
    };
    this.db
      .collection<MeetingAssistant>('meeting-assistant')
      .doc(id)
      .set(meetingAssistant, { merge: true });
  }

  deleteMeetingAssistant(meetingId: string, volunteerId: string): void {
    const id: string = `${meetingId}_${volunteerId}`;
    this.db
      .collection<MeetingAssistant>('meeting-assistant')
      .doc(id)
      .delete();
  }
}
