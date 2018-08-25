import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

const SpinnerId: string = '#login-spinner';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  errorMessage: string;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {}

  login(email: string, password: string): void {
    $(SpinnerId).modal('show');
    this.firebaseAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(_ => {
        this.errorMessage = '';
        $(SpinnerId).modal('hide');
        this.router.navigate(['/']);
      })
      .catch(error => {
        this.errorMessage = error.message;
        $(SpinnerId).modal('hide');
      });
  }

  logout(): void {
    this.firebaseAuth.auth
      .signOut()
      .then(_ => this.router.navigate(['/login']));
  }
}
