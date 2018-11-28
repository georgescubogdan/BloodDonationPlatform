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
    }
}
