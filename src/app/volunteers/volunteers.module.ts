import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VolunteersRoutingModule } from './volunteers-routing.module';
import { VolunteersComponent } from './volunteers.component';

@NgModule({
  imports: [CommonModule, FormsModule, VolunteersRoutingModule],
  declarations: [VolunteersComponent]
})
export class VolunteersModule {}
