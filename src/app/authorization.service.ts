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
 
  get canRead(): boolean {
    const allowed = ['admin', 'author', 'reader']
    return this.matchingRole(allowed)
  }

  get canEdit(): boolean {
    const allowed = ['admin', 'author']
    return this.matchingRole(allowed)
  }

  get canDelete(): boolean {
    const allowed = ['admin']
    return this.matchingRole(allowed)
  }

  /// Determine if any matching roles exist
  private matchingRole(allowedRoles): boolean {
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
