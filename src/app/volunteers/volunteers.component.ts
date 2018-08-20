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
  volunteers$: Observable<Array<IVolunteer>>;

  constructor(private volunteersService: VolunteersService) {
    this.volunteers$ = this.volunteersService.getVolunteers();
  }

  ngOnInit(): void {
    $('select.dropdown').dropdown();
  }

  openAddVolunteersModal(): void {
    $('.ui.modal').modal('show');
  }
}
