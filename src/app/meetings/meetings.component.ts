import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MeetingsService } from './meetings.service';
import { Meeting } from './meeting';

declare const $: any;

@Component({
  selector: 'sw-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {
  meetings$: Observable<Array<Meeting>>;

  constructor(private meetingsService: MeetingsService) {
    this.meetings$ = this.meetingsService.getMeetings();
  }

  ngOnInit(): void {
    $('#example1').calendar();
  }

  showEditMeetingModal(): void {
    $('#edit-meeting-modal').modal('show');
  }
}
