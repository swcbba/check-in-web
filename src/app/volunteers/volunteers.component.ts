import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { VolunteersService } from './volunteers.service';
import { IVolunteer } from './i-volunteer';

declare const $: any;

@Component({
  selector: 'sw-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss']
})
export class VolunteersComponent implements OnInit {
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
      }
    });
  }

  showEditVolunteerModal(volunteer: IVolunteer = this.currentVolunteer): void {
    if (volunteer.id) {
      this.currentVolunteer = Object.assign({}, volunteer);
    }
    $('#team-select').dropdown('set selected', this.currentVolunteer.team);
    $('#edit-volunteer-modal').modal('show');
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

  private initCurrentVolunteer(): void {
    this.currentVolunteer = {
      id: '',
      name: '',
      cellphone: null,
      email: '',
      team: ''
    };
  }
}
