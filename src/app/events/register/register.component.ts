import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NotyfService } from 'ng-notyf';

import { EventAssistant, AssistantDeleteFlag } from '../event-assistant';
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
  eventAssistants$: Observable<Array<EventAssistant>>;
  currentAssistant: EventAssistant;
  eventName: string;
  private eventId: string;
  private checkInAssistants: Array<string>;
  private showNotifications: boolean;
  private eventsSubscription: Subscription;
  private checkInSubscription: Subscription;

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private notyfService: NotyfService
  ) {
    this.checkInAssistants = new Array();
    this.showNotifications = false;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.initEventData();
      this.initCheckInNotifications();
    });
  }

  ngOnDestroy(): void {
    this.checkInSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
    this.hideRegisterAssistantModal();
    $('body .modals').remove();
  }

  showRegisterAssistantModal(
    assistant: EventAssistant = this.currentAssistant
  ): void {
    if (assistant) {
      if (assistant.id) {
        this.currentAssistant = Object.assign({}, assistant);
      }
      $(DrinkSelectId).dropdown('set selected', this.currentAssistant.drink);
      $(RegisterAssistantModalId).modal('show');
    }
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

  updateAssistant(assistant: EventAssistant): void {
    assistant.checkin = !assistant.checkin;
    this.eventsService.updateEventAssistant(assistant);
  }

  deleteCurrentAssistant(): void {
    this.eventsService.softDeleteEventAssistant(this.currentAssistant);
    this.hideRegisterAssistantModal();
  }

  private initEventData(): void {
    this.eventsSubscription = this.eventsService
      .getEvent(this.eventId)
      .subscribe(event => {
        if (event) {
          this.eventName = event.name;
          this.initCurrentAssistant();
          this.initUIElements();
          this.eventAssistants$ = this.eventsService.getEventAssistants(
            this.eventId
          );
        }
      });
  }

  private initCheckInNotifications(): void {
    this.checkInSubscription = this.eventsService
      .getEventAssistantsThatMadeCheckIn(this.eventId)
      .subscribe(assistants => {
        if (this.showNotifications) {
          const newCheckIns: Array<string> = assistants.filter(
            item => this.checkInAssistants.indexOf(item) < 0
          );
          if (newCheckIns[0]) {
            this.notyfService.success(`${newCheckIns[0]} hizo check in`);
          }
        }
        this.checkInAssistants = assistants;
        this.showNotifications = true;
      });
  }

  private initCurrentAssistant(): void {
    this.currentAssistant = {
      id: '',
      eventId: this.eventId,
      event: this.eventName,
      ticketNumber: '',
      name: '',
      email: '',
      phoneNumber: null,
      checkin: false,
      date: null,
      deleteFlag: AssistantDeleteFlag.No
    };
  }

  private initUIElements(): void {
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
  }
}
