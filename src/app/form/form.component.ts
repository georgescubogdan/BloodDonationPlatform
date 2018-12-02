import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  canDonate = false;
  formCompleted = false;
  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {
  }

  submit() {
    this.canDonate = true;
    this.formCompleted = true;
  }

  donate() {
    let uid = this.afAuth.auth.currentUser.uid;
    console.log('donations/' + uid + '/');
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    let date = mm + '/' + dd + '/' + yyyy;

    let data = {
      date: date,
      pending: true
      //other stuff 
    }
    this.db.list('donations/' + uid + '/').push(data);
    this.router.navigate(['/user/results']);
  }
}
