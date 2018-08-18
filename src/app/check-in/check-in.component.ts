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
  staff: any[];
  assitanceStaff: any[] = [];

  constructor(private db: AngularFirestore) {
    this.volunteers$ = this.db.collection<any>('volunteers').valueChanges();
    this.volunteers$.subscribe(volunteers => {
      this.staff = volunteers;
      this.initializeSearcher();
    });
  }

  ngOnInit() {}

  initializeSearcher(): void {
    $('.ui.search').search({
      source: this.staff,
      searchFields: ['name'],
      fields: {
        title: 'name'
      },
      onSelect: (result, response) => {
        this.assitanceStaff.push(result);
      }
    });
  }
}
