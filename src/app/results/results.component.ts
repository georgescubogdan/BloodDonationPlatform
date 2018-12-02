import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    let uid = this.afAuth.auth.currentUser.uid;
    this.results =  this.db.list('donations/' + uid + '/').valueChanges();
  }

  ngOnInit() {
  }

}
