import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
const wait = (ms) => new Promise(res => setTimeout(res, ms));
import { take } from 'rxjs/operators';

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
    
    let myData = {}
    let stockSnapshot = this.db.object('donations/' + userKey + '/' + donationKey).snapshotChanges().pipe(take(1));
    stockSnapshot.subscribe(docSnapshot => {
      if (docSnapshot['key']) {
        let o = docSnapshot.payload.val();
        console.log(o);
        myData = o;
      }});
    await wait(100);

    if (myData['pending']){
      let stockKey = myData['group'] + myData['rh'];
      this.updateStock(stockKey, 1);
    }
    
    // this.updateStock('A+', 1);
    // this.updateStock('A-', 1);
    // this.updateStock('B+', 1);
    // this.updateStock('B-', 1);
    // this.updateStock('AB+', 1);
    // this.updateStock('AB-', 1);
    // this.updateStock('O+', 1);
    // this.updateStock('O-', 1);

    const items = this.db.list('stock/');

    console.log(items);

    this.db.object('donations/' + userKey + '/' + donationKey).snapshotChanges().pipe(take(1)).subscribe(docSnapshot => {
      if (docSnapshot.key) {
        this.db.list('donations/' + userKey + '/').update(donationKey, {
          pending: false,
          GLC: Math.floor(Math.random() * 100) + 1,
          VEM: Math.floor(Math.random() * 100) + 1,
          HEM: Math.floor(Math.random() * 100) + 1,
          CHEM:Math.floor(Math.random() * 100) + 1,
          TGP: Math.floor(Math.random() * 50) + 1,
          TGO: Math.floor(Math.random() * 50) + 1,
          GGT: Math.floor(Math.random() * 200) + 1,
          HDL: Math.floor(Math.random() * 100) + 1,
          LDL: Math.floor(Math.random() * 100) + 1,
          //TODO mock de analize de pus in db
        });
      }});
  }

  updateStock(key, quantity) {
    let stockSnapshot = this.db.object('stock/' + key).snapshotChanges().pipe(take(1));
    stockSnapshot.subscribe(docSnapshot => {
      if (docSnapshot['key']) {
        console.log(docSnapshot['payload'].val())
        this.db.object('stock/' + key).update({
          quantity: docSnapshot['payload'].val()['quantity'] + quantity,
        });
      }});
  }
}
  