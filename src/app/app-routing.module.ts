import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import { CheckInComponent } from './check-in/check-in.component';
import { MeetingsComponent } from './meetings/meetings.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: '/meetings',
        pathMatch: 'full'
      },
      {
        path: 'check-in',
        component: CheckInComponent
      },
      {
        path: 'meetings',
        component: MeetingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
