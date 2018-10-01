import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { VolunteersService } from './volunteers.service';
import { Volunteer, VolunteerDeleteFlag } from './volunteer';

const TeamSelectId = '#team-select';
const EditVolunteerModalId = '#edit-volunteer-modal';
const ConfirmDeleteVolunteerModalId = '#confirm-delete-volunteer-modal';
declare const $: any;

@Component({
  selector: 'sw-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss']
})
export class VolunteersComponent implements OnInit, OnDestroy {
  currentVolunteer: Volunteer;
  volunteers$: Observable<Array<Volunteer>>;

  constructor(private volunteersService: VolunteersService) {
    this.initCurrentVolunteer();
    this.volunteers$ = this.volunteersService.getVolunteers();
  }

  ngOnInit(): void {
    $(TeamSelectId).dropdown();
    $(EditVolunteerModalId).modal({
      onHide: _ => {
        $(TeamSelectId).dropdown('clear');
        this.initCurrentVolunteer();
      },
      allowMultiple: true
    });
    $(ConfirmDeleteVolunteerModalId).modal({
      allowMultiple: true
    });
  }

  ngOnDestroy(): void {
    this.hideEditVolunteerModal();
    $('body .modals').remove();
  }

  showEditVolunteerModal(volunteer: Volunteer = this.currentVolunteer): void {
    if (volunteer.id) {
      this.currentVolunteer = Object.assign({}, volunteer);
    }
    $(TeamSelectId).dropdown('set selected', this.currentVolunteer.team);
    $(EditVolunteerModalId).modal('show');
  }

  showDeleteVolunteerModal() {
    $(ConfirmDeleteVolunteerModalId).modal('show');
  }

  hideEditVolunteerModal(): void {
    $(EditVolunteerModalId).modal('hide');
  }

  saveVolunteer(): void {
    if (this.currentVolunteer.id) {
      this.volunteersService.updateVolunteer(this.currentVolunteer);
    } else {
      this.volunteersService.saveVolunteer(this.currentVolunteer);
    }
    this.hideEditVolunteerModal();
  }

  deleteCurrentVolunteer() {
    this.volunteersService.softDeleteVolunteer(this.currentVolunteer);
    this.hideEditVolunteerModal();
  }

  private initCurrentVolunteer(): void {
    this.currentVolunteer = {
      id: '',
      name: '',
      cellphone: null,
      email: '',
      team: '',
      deleteFlag: VolunteerDeleteFlag.No
    };
  }
}
