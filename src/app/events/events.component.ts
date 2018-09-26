import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { EventsService } from './events.service';
import { Event } from './event';

const AddEditEventModalId = '#add-edit-event-modal';
const DatetimeInputId = '#event-datetime';
declare const $: any;

@Component({
  selector: 'sw-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnDestroy {
  currentEvent: Event;
  events$: Observable<Array<Event>>;

  constructor(private eventsService: EventsService) {
    this.initEvent();
    this.events$ = this.eventsService.getEvents();
  }

  ngOnDestroy(): void {
    this.hideAddEditEventModal();
    $('body .modals').remove();
  }

  showAddEditEventModal(): void {
    $(AddEditEventModalId).modal('show');
    $(DatetimeInputId).calendar({
      onChange: date => {
        this.currentEvent.date = date;
      }
    });
  }

  hideAddEditEventModal(): void {
    $(AddEditEventModalId).modal('hide');
  }

  saveEvent(): void {
    console.log(this.currentEvent);
    this.hideAddEditEventModal();
  }

  private initEvent(): void {
    this.currentEvent = {
      id: null,
      name: null,
      date: null,
      place: null
    };
  }
}
