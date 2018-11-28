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
    const allowed = ['user']
    return this.matchingRole(allowed)
  }

  get isDoctor(): boolean {
    const allowed = ['doctor']
    return this.matchingRole(allowed)
  }

  get isNurse(): boolean {
    const allowed = ['nurse']
    return this.matchingRole(allowed)
  }



  /// Determine if any matching roles exist
  private matchingRole(allowedRoles): boolean {
    console.log(this.userRoles)
    console.log(!_.isEmpty(_.intersection(allowedRoles, this.userRoles)))
    return !_.isEmpty(_.intersection(allowedRoles, this.userRoles))
  }
  constructor(private auth: AuthService,
    private db: AngularFireDatabase) {

      auth.user.pipe(map(user => {
        /// Set an array of user roles, ie ['admin', 'author', ...]
        return this.userRoles = _.keys(_.get(user, 'roles'))
      }))
      .subscribe()
    }
}
