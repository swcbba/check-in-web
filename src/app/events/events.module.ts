import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './events.component';
import { RegisterComponent } from './register/register.component';
import { TemplateGenerator } from './template-generator/template-generator.component';

@NgModule({
  imports: [CommonModule, FormsModule, EventsRoutingModule],
  declarations: [EventsComponent, RegisterComponent, TemplateGenerator]
})
export class EventsModule {}
