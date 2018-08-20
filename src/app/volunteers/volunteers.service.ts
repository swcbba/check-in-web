import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { IVolunteer } from './i-volunteer';

@Injectable({
  providedIn: 'root'
})
export class VolunteersService {
  constructor(private db: AngularFirestore) {}

  getVolunteers(): Observable<Array<IVolunteer>> {
    return this.db
      .collection<IVolunteer>('volunteers', ref => ref.orderBy('name', 'asc'))
      .valueChanges();
  }

  saveVolunteer(volunteer: IVolunteer): void {
    volunteer.id = this.db.createId();
    this.db
      .collection<IVolunteer>('volunteers')
      .doc(volunteer.id)
      .set(volunteer, { merge: true });
  }

  updateVolunteer(volunteer: IVolunteer): void {
    this.db
      .collection<IVolunteer>('volunteers')
      .doc(volunteer.id)
      .update(volunteer);
  }
}
