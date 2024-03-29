import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import * as _ from 'lodash'
@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  userRoles: Array<string>;
  approved: boolean = false;
  loggedIn: boolean = false;
  /// the rule
 
  get isUser(): boolean {
    const allowed = 'user';
    return this.matchingRole(allowed);
  }

  get isDoctor(): boolean {
    const allowed = 'doctor';
    return this.matchingRole(allowed);
  }

  get isNurse(): boolean {
    const allowed = 'nurse';
    return this.matchingRole(allowed);
  }
  
  get isAdmin(): boolean {
    const allowed = 'admin';
    return this.matchingRole(allowed);
  }

  get isApproved(): boolean {
    return this.approved;
  }
  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  /// Determine if any matching roles exist
  private matchingRole(allowedRoles): boolean {
    return this.userRoles == allowedRoles;
  }
  constructor(private auth: AuthService,
    private db: AngularFireDatabase) {

      auth.user.pipe(map(user => {
        /// Set an array of user roles, ie ['admin', 'author', ...]
        return this.userRoles = _.findKey(_.get(user, 'roles'), function(value) {
          return value == true;
        })
        //_.findKey(object, predicate, [context]) 
      }))
      .subscribe();
      auth.user.pipe(map(user => {
        console.log(_.get(user, 'approved'))
        console.log(user)
        if (user == null) {
          this.loggedIn = false;
        } else {
          this.loggedIn = true;
        }
        return this.approved = _.get(user, 'approved')
      })).subscribe();
    }
}
