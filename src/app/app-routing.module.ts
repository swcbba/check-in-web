import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellComponent } from './shell/shell.component';

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
        path: 'meetings',
        loadChildren: './meetings/meetings.module#MeetingsModule'
      },
      {
        path: 'volunteers',
        loadChildren: './volunteers/volunteers.module#VolunteersModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
