import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
const wait = (ms) => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class NurseDonationsComponent implements OnInit {
  userKeys : any[] = [];
  donations: Observable<any[]>[] = [];
  donationKeys: any[] = [];
  constructor(private db: AngularFireDatabase) { 
   
    
  }
  
  ngOnInit() {
    this.getUserKeysAndDonations();
    console.log(this.userKeys);
    // this.userKeys.forEach(key => {
    //   console.log(key)
    //   this.donations.push(this.db.list('donations/' + key + '/').valueChanges());
    // });
  }
  
  getUserKeysAndDonations() {
    return this.db.list('users/')
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.userKeys.includes(e.key)) {
            this.userKeys.push(e.key);
            let donationList = this.db.list('donations/' + e.key + '/').valueChanges();
            this.donations.push(donationList);
          }
        });
      })
  }
  getDonationKeys(key) {
    this.donationKeys = [];
    return this.db.list('donations/' + key + '/')
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.donationKeys.includes(e.key)) {
            this.donationKeys.push(e.key);
          }
        });
      })
  }
  async analyze(j, i) {
    console.log(j)
    console.log(i)
    let userKey = this.userKeys[j]
    this.getDonationKeys(userKey);
    await wait(100);
    console.log(this.donationKeys)
    let donationKey = this.donationKeys[i];
    await console.log(donationKey)
    this.db.object('donations/' + userKey + '/' + donationKey).snapshotChanges().subscribe(docSnapshot => {
      if (docSnapshot.key) {
        this.db.list('donations/' + userKey + '/').update(donationKey, {
          pending: false
          //TODO mock de analize de pus in db
        });
      }});
  }
}
  