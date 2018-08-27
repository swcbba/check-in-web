import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication/authentication.service';

declare const $: any;

@Component({
  selector: 'sw-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  constructor(public authService: AuthenticationService) {}

  ngOnInit() {
    $('.context .ui.sidebar')
      .sidebar({
        context: $('.context .bottom.segment')
      })
      .sidebar('attach events', '.context .menu .toggle.item');
  }
}
