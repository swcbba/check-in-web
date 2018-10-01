import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NotyfService } from 'ng-notyf';

import { EventAssistant, AssistantDeleteFlag } from '../event-assistant';
import { EventsService } from '../events.service';
import { TemplateGenerator } from '../template-generator/template-generator.component';

const DrinkSelectId = '#drink-select';
const RegisterAssistantModalId = '#register-assistant-modal';
const ConfirmDeleteAssistantModalId = '#confirm-delete-assistant-modal';
const modalGenerator = '#modal-generator';
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
  data: any = {};
  print = false;
  @ViewChild('printModal') printModal: TemplateGenerator;
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
    this.notyfService.toastContainerStyle = { position: 'fixed' };
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

  printTicket(assistant) {
    this.data.text = assistant.event + ' | ' + 'Ticket number:| ' + assistant.ticketNumber + ' | '+ assistant.name;
    this.data.name = assistant.name;
    this.data.place = 'Capresso cafe';
    this.data.address = 'Av. Salamanca';
    const date = assistant.date;
    this.data.day = date.getDate();
    this.data.hour = date.getHours() + ':' + date.getMinutes()
    const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
    "JUL", "AGO", "SEP", "OCT", "NOV", "DEC"];
    this.data.month = monthNames[date.getMonth()];
    this.printModal.load(this.data);
    $(modalGenerator).modal('show');
  }

  printTemplate() {
    this.printModal.print();
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
        if (!this.showNotifications) {
          setTimeout(_ => {
            this.showNotifications = true;
          }, 10);
        }
        this.checkInAssistants = assistants;
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
