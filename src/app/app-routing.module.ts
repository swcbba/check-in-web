import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from './authentication/authentication.guard';
import { ShellComponent } from './shell/shell.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    canActivate: [AuthenticationGuard]
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: '',
        redirectTo: '/meetings',
        pathMatch: 'full'
      },
      {
        path: 'meetings',
        loadChildren: './meetings/meetings.module#MeetingsModule'
      },
      {
        path: 'volunteers',
        loadChildren: './volunteers/volunteers.module#VolunteersModule'
      },
      {
        path: 'events',
        loadChildren: './events/events.module#EventsModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
