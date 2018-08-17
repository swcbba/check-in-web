import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
declare const $: any;

@Component({
  selector: 'sw-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  volunteers$: Observable<any[]>;
  constructor(private db: AngularFirestore) {
    this.volunteers$ = this.db.collection<any>('volunteers').valueChanges();
  }

  ngOnInit() {
    $('#sw-volunteers-search').select2({
      placeholder: "Selecciona un miembro",
      allowClear: true
    });
  }

}
