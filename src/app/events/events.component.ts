import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Observable } from 'rxjs';

import { EventsService } from './services/events.service';
import { Event } from './models/event';

const AddEditEventModalId = '#add-edit-event-modal';
const DatetimeInputId = '#event-datetime';
const NoPictureURL = './assets/img/no-image.png';
declare const $: any;

@Component({
  selector: 'sw-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {
  currentEvent: Event;
  events$: Observable<Array<Event>>;
  private currentEventPicture: File;
  private pictureFileReader: FileReader;
  @ViewChild('eventPicture')
  private eventPictureElement: ElementRef;

  constructor(private eventsService: EventsService) {
    this.initCurrentEvent();
    this.events$ = this.eventsService.getEvents();
    this.pictureFileReader = new FileReader();

    this.pictureFileReader.onloadend = () => {
      this.eventPictureElement.nativeElement.src = this.pictureFileReader.result;
    };
  }

  ngOnInit(): void {
    $(AddEditEventModalId).modal({
      onHide: _ => {
        this.initCurrentEvent();
        this.eventPictureElement.nativeElement.src = NoPictureURL;
      },
      allowMultiple: true
    });
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

  setEventPicture(element: any): void {
    this.currentEventPicture = element.files[0];

    if (this.currentEventPicture) {
      this.pictureFileReader.readAsDataURL(this.currentEventPicture);
    } else {
      this.eventPictureElement.nativeElement.src = NoPictureURL;
    }
  }

  saveEvent(): void {
    this.eventsService.saveEvent(this.currentEvent);
    if (this.currentEventPicture) {
      this.eventsService.saveEventPicture(
        this.currentEvent,
        this.currentEventPicture
      );
    }
    this.hideAddEditEventModal();
  }

  private initCurrentEvent(): void {
    this.currentEvent = {
      id: null,
      name: null,
      date: null,
      place: null,
      pictureURL: NoPictureURL
    };
    this.currentEventPicture = null;
  }
}
