import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VolunteersRoutingModule } from './volunteers-routing.module';
import { VolunteersComponent } from './volunteers.component';

@NgModule({
  imports: [CommonModule, VolunteersRoutingModule],
  declarations: [VolunteersComponent]
})
export class VolunteersModule {}
