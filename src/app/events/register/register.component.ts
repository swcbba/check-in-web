import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NotyfService } from 'ng-notyf';

import { EventAssistant, AssistantDeleteFlag } from '../models/event-assistant';
import { EventsService } from '../services/events.service';
import { TemplateGeneratorComponent } from '../template-generator/template-generator.component';
import { VoucherOperation } from '../models/voucher-operation.enum';
import { Event } from '../models/event';

const RegisterAssistantModalId = '#register-assistant-modal';
const ConfirmDeleteAssistantModalId = '#confirm-delete-assistant-modal';
const modalGenerator = '#modal-generator';
const monthNames = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
];
declare const $: any;

@Component({
  selector: 'sw-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  eventAssistants$: Observable<Array<EventAssistant>>;
  currentAssistant: EventAssistant;
  currentAssistantVouchers: Array<string>;
  event: Event;
  eventName: string;
  data: any = {};
  print = false;
  @ViewChild('printModal')
  printModal: TemplateGeneratorComponent;
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
      this.processVouchers(VoucherOperation.INIT);
      if (assistant.id) {
        this.currentAssistant = this.cloneObject(assistant);
      }
      this.processVouchers(VoucherOperation.SET);
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
    let i = 0;
    while (i < this.currentAssistant.vouchers.length) {
      if (!this.currentAssistant.vouchers[i]) {
        this.currentAssistant.vouchers[i] = '';
      }
      i++;
    }
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

  printTicket(assistant: EventAssistant): void {
    const date = this.event.date;
    this.data.text =
      assistant.event +
      ' | ' +
      'Ticket number:| ' +
      assistant.ticketNumber +
      ' | ' +
      assistant.name;
    this.data.name = assistant.name;
    this.data.place = this.event.place;
    this.data.address = 'Av. Potosí';
    this.data.day = date.getDate();
    this.data.hour = date.getHours() + ':' + date.getMinutes();
    this.data.month = monthNames[date.getMonth()];
    this.printModal.load(this.data);
    $(modalGenerator).modal('show');
  }

  printTemplate(): void {
    this.printModal.print();
  }

  private initEventData(): void {
    this.eventsSubscription = this.eventsService
      .getEvent(this.eventId)
      .subscribe(event => {
        if (event) {
          this.event = event;
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
      vouchers: new Array(this.event.vouchers.length),
      deleteFlag: AssistantDeleteFlag.No
    };
    this.currentAssistantVouchers = new Array(this.event.vouchers.length);
  }

  private initUIElements(): void {
    $(RegisterAssistantModalId).modal({
      onHide: _ => {
        this.processVouchers(VoucherOperation.CLEAR);
        this.initCurrentAssistant();
      },
      allowMultiple: true
    });
    $(ConfirmDeleteAssistantModalId).modal({
      allowMultiple: true
    });
  }

  private processVouchers(operation: VoucherOperation): void {
    let i = 0;
    this.event.vouchers.forEach(voucher => {
      const selectId = `#${voucher.name}${i}`;
      switch (operation) {
        case VoucherOperation.INIT:
          this.initSelectedVoucher(selectId);
          break;
        case VoucherOperation.CLEAR:
          this.clearSelectedVoucher(selectId);
          break;
        case VoucherOperation.SET:
          this.setSelectedVoucher(selectId, this.currentAssistant.vouchers[i]);
          break;
        default:
          break;
      }
      i++;
    });
  }

  private initSelectedVoucher(selectId: string): void {
    $(selectId).dropdown();
  }

  private clearSelectedVoucher(selectId: string): void {
    $(selectId).dropdown('clear');
  }

  private setSelectedVoucher(selectId: string, voucher: string): void {
    if (voucher) {
      $(selectId).dropdown('set selected', voucher);
    }
  }

  private cloneObject(src: any) {
    return JSON.parse(JSON.stringify(src));
  }
}
