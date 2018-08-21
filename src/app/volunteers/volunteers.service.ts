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
}
