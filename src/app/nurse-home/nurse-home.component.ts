import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { map, filter, take } from 'rxjs/operators';
import { MatYearView } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
const wait = (ms) => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-nurse-home',
  templateUrl: './nurse-home.component.html',
  styleUrls: ['./nurse-home.component.css']
})
export class NurseHomeComponent implements OnInit {
  types = ['', 'A', 'B', 'O', 'AB'];
  rhs = ['', '+', '-'];
  newRequestForm: FormGroup;

  requests: Observable<any[]>;
  stocks: Observable<any[]>;
  users: Observable<any[]>;
  filteredUsers: Observable<any[]>;
  centers: Observable<any[]>;

  centersList: any[] = [];
  userKeys: any[] = [];
  requestKeys: any[] = [];
  stockKeys: any[] = [];
  filteredKeysByGroup: any[] = [];
  filteredKeysByRole: any[] = [];
  filteredKeys: any[] = [];
  req;
  public qty: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  constructor(private formBuilder: FormBuilder, private db: AngularFireDatabase, private router: Router) { 
    this.requests = this.db.list('requests/').valueChanges();
    this.stocks = this.db.list('stock/').valueChanges();
    this.users = this.db.list('users/').valueChanges();
    this.centers = this.db.list('centers/').valueChanges();

    
  }

  
  getColor(priority) { 
    switch (priority) {
      case 1:
        return 'yellow';
      case 2:
        return 'orange';
      case 3:
        return '#cc0000';
    }
  }
  
  distanceBetweenTwoPoints(lat1, lon1, lat2, lon2, unit="K") {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  getDistance(user) {
    // mock blood center
    let lat_ref = 45;
    let lon_ref = 25;

    let lat = user.coordinates.latitude;
    let lon = user.coordinates.longitude;
    // console.log(lat, lon);

    // TODO: distanta pana la centre

    // return this.centersList.
    //     filter(
    //       center => center.hasOwnProperty('coordinates')).
    //     map(
    //       center => this.distanceBetweenTwoPoints(lat, lon, center.coordinates.latitude, center.coordinates.longitude)
    //     );
    return this.distanceBetweenTwoPoints(lat_ref, lon_ref, lat, lon);
  }

  getUsersByRole(role: String) {
    return this.users
      .pipe(map(us => us.filter(user => user.roles.role === true)));
  }

  ngOnInit() {
    this.newRequestForm = this.formBuilder.group({
      bloodType: [''],
      rh: ['']
    });

    this.getRequestKeys();
    this.getStockKeys();
    this.getUserKeys();
    this.getCenters();
    //this.notifyUsers();
    
   // console.log(this.getRequestsData());

   // TODO filtreaza dupa grupa
   console.log(this.newRequestForm.value);
   let group = this.newRequestForm.value.bloodType;
   let rh = this.newRequestForm.value.rh;

   this.filteredUsers = this.users.pipe(
     (map(us => us.filter(
       user => user.approved === true && 
       user.roles.user === true &&
       user.hasOwnProperty('coordinates') 
       &&
       (rh === '' || user.rh === rh) &&
       (group === '' || user.group === group)

       )))
   );


  }

  async notifyUsers(group, rh) {
    this.getfilteredKeysByRole('user');
    this.getfilteredKeysByGroup(group, rh);
    await wait(100);
    this.filteredKeys = _.intersection(this.filteredKeysByGroup, this.filteredKeysByRole);
    // console.log(this.filteredKeysByGroup);
    // console.log(this.filteredKeysByRole);
    // console.log(this.filteredKeys);
    this.filteredKeys.forEach(key => {
      this.db.list('notify/' + key).push(
        {
          title: 'Am nevoieee de tineeeee!',
          body: 'Sa imi donezi! Am nevoieee de tineeeee!'
        }
      );
    });
    
  }

  getfilteredKeysByGroup(group, rh) {
    return this.db.list('users/', ref => ref.orderByChild('groupRH').equalTo(group+rh))
      .snapshotChanges().subscribe(
          snapshot => {
            snapshot.forEach(e => {
              if (!this.filteredKeysByGroup.includes(e.key)) {
                this.filteredKeysByGroup.push(e.key);
              }
            });
          })
  }

  getfilteredKeysByRole(role) {
    return this.db.list('users/', ref => ref.orderByChild('roles/' + role).startAt(true).endAt(true))
      .snapshotChanges().subscribe(
          snapshot => {
            snapshot.forEach(e => {
              if (!this.filteredKeysByRole.includes(e.key)) {
                this.filteredKeysByRole.push(e.key);
              }
            });
          })
  }

  onSubmit() {
    if (this.newRequestForm.valid)
    {
      let data = this.newRequestForm.value;
      // data.finalized = false;
      console.log(data);
      // TODO filtreaza dupa grupa
      console.log(this.newRequestForm.value);
      let group = this.newRequestForm.value.bloodType;
      let rh = this.newRequestForm.value.rh;

      this.filteredUsers = this.users.pipe(
        (map(us => us.filter(
          user => user.approved === true && 
          user.roles.user === true &&
          user.hasOwnProperty('coordinates') 
          &&
          (rh === '' || user.rh === rh) &&
          (group === '' || user.group === group)

          )))
      );
    }
  }

  getRequestKeys() {
    return this.db.list('requests/')
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.requestKeys.includes(e.key)) {
            this.requestKeys.push(e.key);
          }
        });
      })
  }

  getStockKeys() {
    return this.db.list('stock/')
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.stockKeys.includes(e.key)) {
            this.stockKeys.push(e.key);
          }
        });
      })
  }

  getCenters() {
    return this.db.list('centers/')
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          
            this.centersList.push(e.key);
          
        });
      })
  }

  getUserKeys() {
    return this.db.list('users/')
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.userKeys.includes(e.key)) {
            this.userKeys.push(e.key);
          }
        });
      })
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

  async completeRequest(index) {
    let reqId = this.requestKeys[index];
    let snapshot = this.db.object('requests/' + reqId).snapshotChanges().pipe(take(1));
    let key = "";
    let qNeeded = 0;

    // get key and qNeeded
    snapshot.subscribe(docSnapshot => {
      if (docSnapshot.key && !docSnapshot.payload.val()['finalized']) {
        console.log(docSnapshot.payload.val())
        key = docSnapshot.payload.val()['bloodType'] + docSnapshot.payload.val()['rh']
        qNeeded = docSnapshot.payload.val()['quantity'] - docSnapshot.payload.val()['recvQuantity'];
      }});
  
    // verifica stocul
    let myData = {}
    let stockSnapshot = this.db.object('stock/' + key).snapshotChanges().pipe(take(1));
    stockSnapshot.subscribe(docSnapshot => {
      if (docSnapshot['key']) {
        let o = docSnapshot['payload'].val();
        console.log(o['quantity']);
        myData = o;
      }});

    await wait(100);
    console.log(key);
    console.log(qNeeded);
    console.log(myData);
    
    snapshot.subscribe(docSnapshot => {
      if (docSnapshot.key && !docSnapshot.payload.val()['finalized']) {
        console.log('verif ' + myData[key]['quantity'] + ' > ' + qNeeded);

        if (Number(myData[key]['quantity']) >= qNeeded){
          this.updateStock(key, -qNeeded);
          this.db.object('requests/' + reqId).update({
            finalized: true,
            recvQuantity: docSnapshot.payload.val()['quantity']
          });
        }
      }});
  }

  async sendBlood(index) {
    console.log(this.qty);
    let quantity = this.qty[index];
    let reqId = this.requestKeys[index];
    let snapshot = this.db.object('requests/' + reqId).snapshotChanges().pipe(take(1));
    let key = "";
    
    // get key 
    snapshot.subscribe(docSnapshot => {
      if (docSnapshot.key && !docSnapshot.payload.val()['finalized']) {
        console.log(docSnapshot.payload.val())
        key = docSnapshot.payload.val()['bloodType'] + docSnapshot.payload.val()['rh'];
      }});
  
    // verifica stocul
    let myData = {}
    let stockSnapshot = this.db.object('stock/' + key).snapshotChanges().pipe(take(1));
    stockSnapshot.subscribe(docSnapshot => {
      if (docSnapshot['key']) {
        let o = docSnapshot['payload'].val();
        console.log(o['quantity']);
        myData = o;
      }});

    await wait(100);
    // console.log(key);
    // console.log(qNeeded);
    // console.log(myData);

    snapshot.subscribe(docSnapshot => {
      if (docSnapshot.key && !docSnapshot.payload.val()['finalized'] && quantity !== 0) {
        console.log(docSnapshot.payload.val())
        // let key = docSnapshot.payload.val()['bloodType'] + docSnapshot.payload.val()['rh']

        console.log('verif ' + myData[key]['quantity'] + ' >= ' + quantity);
        if (Number(myData[key]['quantity']) >= quantity){
          let q: number = Number(docSnapshot.payload.val()['recvQuantity']) + Number(quantity);
          if (q === Number(docSnapshot.payload.val()['quantity'])) {
            this.updateStock(key, -Number(quantity));
            this.db.object('requests/' + reqId).update({
              finalized: true,
              recvQuantity: q
            });
          } else if (q > Number(docSnapshot.payload.val()['quantity'])){
            this.updateStock(key, Number(docSnapshot.payload.val()['recvQuantity']) - Number(docSnapshot.payload.val()['quantity']));
            this.db.object('requests/' + reqId).update({
              finalized: true,
              recvQuantity: docSnapshot.payload.val()['quantity']
            });
          } else {
            this.db.object('requests/' + reqId).update({
              recvQuantity: q
            });
            this.updateStock(key, -Number(quantity));
          }
        }
        this.qty[index] = 0;
      }});
  }
}
