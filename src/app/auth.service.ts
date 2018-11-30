import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from './user'

// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthService { 

  user: BehaviorSubject<User> = new BehaviorSubject(null)

  constructor(public afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private router: Router) {


      this.afAuth.authState.pipe(
        switchMap(auth => {
          if (auth) {
            /// signed in
            return this.db.object('users/' + auth.uid).valueChanges()
          } else {
            /// not signed in
            return of(null)
          }
        }))
        .subscribe(user => {
          this.user.next(user)
        })
    }


    ///// SignIn - SignOut Process /////

    googleLogin() {
      const provider = new firebase.auth.GoogleAuthProvider()
      return this.afAuth.auth.signInWithPopup(provider)
        .then(credential =>  {
            this.updateUser(credential.user)
        })
    }

    signOut() {
      this.afAuth.auth.signOut();
      this.router.navigate(['/login']);
    }

    doLogin(email: string, password: string, role: string = 'user'): Promise<any>{
      return new Promise<any>((resolve, reject) => {
        let provider = new firebase.auth.EmailAuthProvider();
        this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(res => {
          // this.db.object('users/' + res.user.uid).snapshotChanges().subscribe(docSnapshot => {
          //   if (!docSnapshot.key) {
          //     let roles_tmp = { user: false, doctor: false, nurse: false, approved: false }
          //     roles_tmp[role] = true;
          //     this.db.object('users/' + res.user.uid).set({
          //       email: email,
          //       photoURL: "",
          //       roles: roles_tmp
          //     });
          //   }});
          resolve(res);
        }, err => {
          reject(err);
        })
      });
    }
  
    doRegister(value): Promise<any>{
      console.log(value.email);
      return new Promise<any>((resolve, reject) => {
        let provider = new firebase.auth.EmailAuthProvider();
        this.afAuth.auth
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          console.log('intra')
          this.db.object('users/' + res.user.uid).snapshotChanges().subscribe(docSnapshot => {
            if (!docSnapshot.key) {
              let roles_tmp = { user: false, doctor: false, nurse: false}
              roles_tmp[value.role] = true;
              this.db.object('users/' + res.user.uid).set({
                email: value.email,
                photoURL: "",
                firstName: value.firstName,
                lastName: value.lastName,
                roles: roles_tmp,
                approved: false
              });
            }});
          resolve(res);
        }, err => {
          reject(err);
        })
      });
    }

    //// Update user data ////

    /// updates database with user info after login
    /// only runs if user role is not already defined in database
    private updateUser(authData) {
      const userData = new User(authData)
      const ref = this.db.object('users/' + authData.uid)
      ref.valueChanges()
         .subscribe(user => {
          if (!user['roles']) {
            ref.update(userData)
          }
      })

    }
}