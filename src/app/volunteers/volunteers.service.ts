import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Md5 } from 'ts-md5';

import { IVolunteer, VolunteerDeleteFlag } from './i-volunteer';

@Injectable({
  providedIn: 'root'
})
export class VolunteersService {
  constructor(private db: AngularFirestore) {}

  getVolunteers(): Observable<Array<IVolunteer>> {
    return this.db
      .collection<IVolunteer>('volunteers', ref =>
        ref.where('deleteFlag', '==', 0).orderBy('name', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const md5 = new Md5();
            const data = a.payload.doc.data() as IVolunteer;
            md5.appendStr(data.email);
            data.pictureURL = `https://www.gravatar.com/avatar/${md5.end()}?s=400&d=mp`;
            return data;
          })
        )
      );
  }

  saveVolunteer(volunteer: IVolunteer): void {
    volunteer.id = this.db.createId();
    this.setVolunteer(volunteer);
  }

  updateVolunteer(volunteer: IVolunteer): void {
    this.setVolunteer(volunteer);
  }

  softDeleteVolunteer(volunteer: IVolunteer): void {
    volunteer.deleteFlag = VolunteerDeleteFlag.Yes;
    this.setVolunteer(volunteer);
  }

  private setVolunteer(volunteer: IVolunteer): void {
    this.db
      .collection<IVolunteer>('volunteers')
      .doc(volunteer.id)
      .set(volunteer, { merge: true });
  }
}
