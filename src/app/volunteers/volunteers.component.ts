import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { VolunteersService } from './volunteers.service';
import { IVolunteer } from './i-volunteer';

@Component({
  selector: 'sw-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss']
})
export class VolunteersComponent {
  volunteers$: Observable<Array<IVolunteer>>;

  constructor(private volunteersService: VolunteersService) {
    this.volunteers$ = this.volunteersService.getVolunteers();
  }
}
