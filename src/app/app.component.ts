import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

declare const $: any;

@Component({
  selector: 'sw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private updates: SwUpdate) {
    this.updates.available.subscribe(event => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      this.toggleUpdateSegment();
    });
    this.updates.activated.subscribe(event => {
      console.log('old version was', event.previous);
      console.log('new version is', event.current);
    });
  }

  updateApp(): void {
    this.toggleUpdateSegment();
    document.location.reload();
  }

  toggleUpdateSegment(): void {
    $('#update-app-segment').transition('fade up');
  }
}
