import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private firebaseAuth: AngularFireAuth) {}

  login(email: string, password: string): void {
    this.firebaseAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(user => console.log(user));
  }
}
