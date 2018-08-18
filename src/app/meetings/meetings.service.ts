import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { IMeeting } from './i-meeting';
import { IMeetingAssistant } from './i-meeting-assistant';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService {
  constructor(private db: AngularFirestore) {}

  getMeeting(meetingId: string): Observable<IMeeting> {
    return this.db.doc<IMeeting>(`meetings/${meetingId}`).valueChanges();
  }

  getMeetings(): Observable<Array<DocumentChangeAction<IMeeting>>> {
    return this.db
      .collection<IMeeting>('meetings', ref => ref.orderBy('date', 'asc'))
      .snapshotChanges();
  }

  getMeetingAssistantsByMeeting(
    meetingId: string
  ): Observable<Array<IMeetingAssistant>> {
    return this.db
      .collection<IMeetingAssistant>('meeting-assistant', ref =>
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
      .collection<IMeetingAssistant>('meeting-assistant')
      .doc(id)
      .set(meetingAssistant, { merge: true });
  }

  deleteMeetingAssistant(meetingId: string, volunteerId: string): void {
    const id: string = `${meetingId}_${volunteerId}`;
    this.db
      .collection<IMeetingAssistant>('meeting-assistant')
      .doc(id)
      .delete();
  }
}
