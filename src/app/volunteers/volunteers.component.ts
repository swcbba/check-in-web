import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { VolunteersService } from './volunteers.service';
import { IVolunteer, VolunteerDeleteFlag } from './i-volunteer';

declare const $: any;

@Component({
  selector: 'sw-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss']
})
export class VolunteersComponent implements OnInit, OnDestroy {
  currentVolunteer: IVolunteer;
  volunteers$: Observable<Array<IVolunteer>>;

  constructor(private volunteersService: VolunteersService) {
    this.initCurrentVolunteer();
    this.volunteers$ = this.volunteersService.getVolunteers();
  }

  ngOnInit(): void {
    $('#team-select').dropdown();
    $('#edit-volunteer-modal').modal({
      onHide: _ => {
        $('#team-select').dropdown('clear');
        this.initCurrentVolunteer();
      },
      allowMultiple: true
    });
    $('#confirm-delete-volunteer-modal').modal({
      allowMultiple: true
    });
  }

  ngOnDestroy(): void {
    this.hideEditVolunteerModal();
    $('body .modals').remove();
  }

  showEditVolunteerModal(volunteer: IVolunteer = this.currentVolunteer): void {
    if (volunteer.id) {
      this.currentVolunteer = Object.assign({}, volunteer);
    }
    $('#team-select').dropdown('set selected', this.currentVolunteer.team);
    $('#edit-volunteer-modal').modal('show');
  }

  showDeleteVolunteerModal() {
    $('#confirm-delete-volunteer-modal').modal('show');
  }

  hideEditVolunteerModal(): void {
    $('#edit-volunteer-modal').modal('hide');
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
