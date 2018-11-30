import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {
  users: Observable<any[]>;;
  keys : any[] = [];
  
  constructor(private db: AngularFireDatabase) { 
    this.users = this.db.list('users/').valueChanges();
    
  }
  
  
  ngOnInit() {
    this.getKeys();
    //this.approveUser('ba38MW2JIHfv4SFUZXWHnVFoZN62');
    console.log(this.keys)
  }
  getKeys() {
    return this.db.list('users/')
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.keys.includes(e.key)) {
            this.keys.push(e.key);
          }
        });
      })
    }
    
    approveUser(index) {
      let userId = this.keys[index];
      this.db.object('users/' + userId).snapshotChanges().subscribe(docSnapshot => {
        if (docSnapshot.key) {
          this.db.list('users/').update(userId, {
            approved: true
          });
        }});
      }
    }
    