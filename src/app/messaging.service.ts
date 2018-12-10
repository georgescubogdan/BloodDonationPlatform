import { Injectable }          from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth }     from 'angularfire2/auth';
import * as firebase from 'firebase';
import {MatSnackBar} from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class MessagingService {

  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, public snackBar: MatSnackBar, private router: Router) { }


  updateToken(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (!user) return;

      const data = { [user.uid]: token }
      this.db.object('fcmTokens/').update(data)
    })
  }

  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        console.log(token)
        this.updateToken(token)
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        let snackBarRef = this.snackBar.open(payload.notification.body, 'Ok', {duration: 5000})
        snackBarRef.onAction().subscribe(()=> this.router.navigate(['/user/donate']));
        this.currentMessage.next(payload)
      });

    }
}