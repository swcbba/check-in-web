import { Component, OnDestroy } from '@angular/core';

import { AuthenticationService } from '../authentication/authentication.service';

declare const $: any;

@Component({
  selector: 'sw-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  email: string;
  password: string;

  constructor(public authService: AuthenticationService) {}

  ngOnDestroy(): void {
    $('body .modals').remove();
  }
}
