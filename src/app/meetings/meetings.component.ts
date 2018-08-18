import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MeetingsService } from './meetings.service';
import { IMeeting } from './i-meeting';

@Component({
  selector: 'sw-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent {
  meetings$: Observable<Array<IMeeting>>;

  constructor(private meetingsService: MeetingsService) {
    this.meetings$ = this.meetingsService.getMeetings().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as IMeeting;
          const date = data.date as any;
          data.date = new Date(date.seconds * 1000);
          return data;
        })
      )
    );
  }
}
