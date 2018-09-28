import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Observable } from 'rxjs';

import { EventsService } from './services/events.service';
import { Event } from './event';
import { finalize } from 'rxjs/operators';

const AddEditEventModalId = '#add-edit-event-modal';
const DatetimeInputId = '#event-datetime';
const noPictureURL = './assets/img/no-image.png';
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
        this.eventPictureElement.nativeElement.src = noPictureURL;
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

  addVoucher(element: any): void {
    this.currentEvent.voucherOptions.unshift(element.value);
    element.value = '';
  }

  deleteVoucher(index: number): void {
    this.currentEvent.voucherOptions.splice(index, 1);
  }

  setEventPicture(element: any): void {
    this.currentEventPicture = element.files[0];

    if (this.currentEventPicture) {
      this.pictureFileReader.readAsDataURL(this.currentEventPicture);
    } else {
      this.eventPictureElement.nativeElement.src = noPictureURL;
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
      voucherOptions: new Array(),
      pictureURL: noPictureURL
    };
    this.currentEventPicture = null;
  }
}
