import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { EventsService } from './events.service';
import { IEvent } from './i-event';

@Component({
  selector: 'sw-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  events$: Observable<Array<IEvent>>;

  constructor(private eventsService: EventsService) {
    this.events$ = this.eventsService.getEvents();
  }

  ngOnInit() {}
}
