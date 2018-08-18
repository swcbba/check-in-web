import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'sw-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {
  meetings$: Observable<any>;

  constructor(private db: AngularFirestore) {
    this.meetings$ = this.db
      .collection('meetings', ref => ref.orderBy('date', 'asc'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as any;
            data.date = new Date(data.date.seconds * 1000);
            return data;
          })
        )
      );
  }

  ngOnInit() {}
}
