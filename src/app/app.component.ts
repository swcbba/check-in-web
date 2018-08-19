import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'sw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showUpdateSegment: boolean;

  constructor(private updates: SwUpdate) {
    this.showUpdateSegment = false;
    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      this.showUpdateSegment = true;
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }

  updateApp(): void {
    document.location.reload();
  }

  hideUpdateSegment(): void {
    this.showUpdateSegment = false;
  }
}
