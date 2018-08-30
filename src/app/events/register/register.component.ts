import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IEventAssistant, AssistantDeleteFlag } from '../i-event-assistant';
import { EventsService } from '../events.service';

const DrinkSelectId: string = '#drink-select';
const RegisterAssistantModalId: string = '#register-assistant-modal';
const ConfirmDeleteAssistantModalId: string = '#confirm-delete-assistant-modal';
declare const $: any;

@Component({
  selector: 'sw-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
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
    $(DrinkSelectId).dropdown();
    $(RegisterAssistantModalId).modal({
      onHide: _ => {
        $(DrinkSelectId).dropdown('clear');
        this.initCurrentAssistant();
      },
      allowMultiple: true
    });
    $(ConfirmDeleteAssistantModalId).modal({
      allowMultiple: true
    });

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

  ngOnDestroy(): void {
    this.hideRegisterAssistantModal();
    $('body .modals').remove();
  }

  showRegisterAssistantModal(
    assistant: IEventAssistant = this.currentAssistant
  ): void {
    if (assistant.id) {
      this.currentAssistant = Object.assign({}, assistant);
    }
    $(DrinkSelectId).dropdown('set selected', this.currentAssistant.drink);
    $(RegisterAssistantModalId).modal('show');
  }

  showDeleteAssistantModal(): void {
    $(ConfirmDeleteAssistantModalId).modal('show');
  }

  hideRegisterAssistantModal(): void {
    $(RegisterAssistantModalId).modal('hide');
  }

  saveAssistant(): void {
    if (this.currentAssistant.id) {
      this.eventsService.updateEventAssistant(this.currentAssistant);
    } else {
      this.eventsService.saveEventAssistant(this.currentAssistant);
    }
    this.hideRegisterAssistantModal();
  }

  updateAssistant(assistant): void {
    assistant.checkin = !assistant.checkin;
    this.eventsService.updateEventAssistant(assistant);
  }

  deleteCurrentAssistant(): void {
    this.eventsService.softDeleteEventAssistant(this.currentAssistant);
    this.hideRegisterAssistantModal();
  }

  private initCurrentAssistant(): void {
    this.currentAssistant = {
      id: '',
      ticketNumber: '',
      name: '',
      email: '',
      phoneNumber: null,
      checkin: false,
      deleteFlag: AssistantDeleteFlag.No
    };
  }
}
