import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IEventAssistant } from '../i-event-assistant';
import { EventsService } from '../events.service';

const RegisterAssistantModalId: string = '#register-assistant-modal';
declare const $: any;

@Component({
  selector: 'sw-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  eventAssistants$: Observable<Array<IEventAssistant>>;
  currentAssistant: IEventAssistant;
  private eventId: string;

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute
  ) {
    this.initCurrentAssistant();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.eventsService.getEvent(this.eventId).subscribe(event => {
        if (event) {
          this.currentAssistant.event = event.name;
          this.currentAssistant.eventId = this.eventId;
          this.eventAssistants$ = this.eventsService.getEventAssistants(
            this.eventId
          );
        }
      });
    });
  }

  showRegisterAssistantModal(): void {
    $(RegisterAssistantModalId).modal('show');
  }

  saveAssistant(): void {
    this.eventsService.saveEventAssistant(this.currentAssistant);
  }

  private initCurrentAssistant(): void {
    this.currentAssistant = {
      id: '',
      ticketNumber: '',
      name: '',
      email: '',
      phoneNumber: null,
      checkin: false
    };
  }
}
