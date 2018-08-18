import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingsComponent } from './meetings.component';
import { CheckInComponent } from './check-in/check-in.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingsComponent
  },
  {
    path: ':id/check-in',
    component: CheckInComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRoutingModule {}
