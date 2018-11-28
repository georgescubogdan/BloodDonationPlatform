import { Component } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mps02';

  constructor(private authorization: AuthorizationService, private db: AngularFireDatabase, private authService : AuthService) {

  }
  
  Logout() {
    this.authService.signOut();
  }

}
