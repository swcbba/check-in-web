import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private firebaseAuth: AngularFireAuth, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const authState: Observable<any> = this.firebaseAuth.authState.pipe(
      take(1)
    );
    return authState.pipe(
      map(user => {
        if (state.url === '/login') {
          const falseCondition: boolean = user !== null;
          return this.checkLogIn(falseCondition, '/');
        }
        return this.checkLogIn(user === null, '/login');
      })
    );
  }

  private checkLogIn(falseCondition: boolean, url: string): boolean {
    if (falseCondition) {
      this.router.navigate([url]);
      return false;
    }
    return true;
  }
}
