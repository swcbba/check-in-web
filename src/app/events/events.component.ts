import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { EventsService } from './events.service';
import { Event } from './event';

@Component({
  selector: 'sw-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events$: Observable<Array<Event>>;

  constructor(private eventsService: EventsService) {
    this.events$ = this.eventsService.getEvents();
  }
}
