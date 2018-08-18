import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { VolunteersService } from './volunteers/volunteers.service';
import { AppComponent } from './app.component';
import { ShellComponent } from './shell/shell.component';

@NgModule({
  declarations: [AppComponent, ShellComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [VolunteersService],
  bootstrap: [AppComponent]
})
export class AppModule {}
