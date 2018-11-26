import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class DoctorGuard implements CanActivate {
  constructor (private auth: AuthService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.auth.user.pipe(
      take(1)).pipe(
      map(user => _.has(_.get(user, 'roles'), 'doctor')),
      tap(authorized => {
        if (!authorized) {
          console.log('route prevented!')
          this.router.navigate(['/login']);
        }
      }))
  }
}
