import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingsService } from './meetings.service';
import { MeetingsRoutingModule } from './meetings-routing.module';
import { MeetingsComponent } from './meetings.component';
import { CheckInComponent } from './check-in/check-in.component';

@NgModule({
  imports: [CommonModule, MeetingsRoutingModule],
  declarations: [MeetingsComponent, CheckInComponent],
  providers: [MeetingsService]
})
export class MeetingsModule {}
