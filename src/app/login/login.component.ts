import { Component } from '@angular/core';

import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'sw-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(public authService: AuthenticationService) {}
}
