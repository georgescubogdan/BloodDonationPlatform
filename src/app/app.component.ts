import { Component } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mps02';

  constructor(private authorization: AuthorizationService, private db: AngularFireDatabase) {

  }
  editPost(post, newData) {
    if ( this.authorization.canEdit ) {
      return this.db.object('posts/' + post.$key).update(newData)
    }
    else console.log('action prevented!')
  }

  deletePost(key) {
    if ( this.authorization.canDelete ) {
      return this.db.list('posts/' + key).remove()
    }
    else console.log('action prevented!')
  }

}
