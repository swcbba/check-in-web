import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { MeetingsService } from './meetings.service';
import { Meeting } from './meeting';

@Component({
  selector: 'sw-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent {
  meetings$: Observable<Array<Meeting>>;

  constructor(private meetingsService: MeetingsService) {
    this.meetings$ = this.meetingsService.getMeetings();
  }
}
