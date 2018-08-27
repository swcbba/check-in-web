import { Component } from '@angular/core';
import { Observable } from 'rxjs';

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
    this.meetings$ = this.meetingsService.getMeetings();
  }
}
