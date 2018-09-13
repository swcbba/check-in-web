import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MeetingsRoutingModule } from './meetings-routing.module';
import { MeetingsComponent } from './meetings.component';
import { CheckInComponent } from './check-in/check-in.component';

@NgModule({
  imports: [CommonModule, FormsModule, MeetingsRoutingModule],
  declarations: [MeetingsComponent, CheckInComponent]
})
export class MeetingsModule {}
