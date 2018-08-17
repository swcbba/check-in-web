import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subject } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
declare const $: any;

@Component({
  selector: 'sw-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  volunteers$: Observable<any[]>;
  startAt: Subject<{}> = new Subject();
  endAt: Subject<{}> = new Subject();
  volunteers: Array<any> = new Array<any>();
  allVolunteers: Array<any> = new Array<any>();

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  constructor(private db: AngularFirestore) {
    this.volunteers$ = this.db.collection<any>('volunteers').valueChanges();
  }

  ngOnInit() {
    this.getAllVolunteers().subscribe((volunteers) => {
      this.allVolunteers = volunteers;
    });

    combineLatest(this.startobs, this.endobs).subscribe((value) => {
      this.firequery(value[0], value[1]).subscribe((volunteers) => {
        this.volunteers = volunteers;
      });
    });
  }

  search(event) {
    const searchText = event.target.value;
    if (searchText !== '') {
      this.startAt.next(searchText);
      this.endAt.next(searchText + '\uf8ff');
    } else {
      this.volunteers = this.allVolunteers;
    }
  }

  firequery(start, end) {
    return this.db.collection('volunteers', ref => ref.orderBy('name').startAt(start).endAt(end)).valueChanges();
  }

  getAllVolunteers() {
    return this.db.collection('volunteers', ref => ref.orderBy('name')).valueChanges();
  }
}
