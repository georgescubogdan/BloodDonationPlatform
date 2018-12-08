import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { map, filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-nurse-requests',
  templateUrl: './nurse-requests.component.html',
  styleUrls: ['./nurse-requests.component.css']
})
export class NurseRequestsComponent implements OnInit {
  requests: Observable<any[]>;
  stocks: Observable<any[]>;
  users: Observable<any[]>;
  filteredUsers: Observable<any[]>;
  centers: Observable<any[]>;

  centersList: any[] = [];
  userKeys: any[] = [];
  requestKeys: any[] = [];
  stockKeys: any[] = [];
  req;
  public qty: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  constructor(private db: AngularFireDatabase) { 
    this.requests = this.db.list('requests/').valueChanges();
    this.stocks = this.db.list('stock/').valueChanges();
    this.users = this.db.list('users/').valueChanges();
    this.centers = this.db.list('centers/').valueChanges();

    this.filteredUsers = this.users.pipe(
      (map(us => us.filter(
        user => user.approved === true && 
        user.roles.user === true &&
        user.hasOwnProperty('coordinates')
        )))
    );
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
    
    // blood center
    let lat_ref = 45;
    let lon_ref = 25;

    let lat = user.coordinates.latitude;
    let lon = user.coordinates.longitude;
    console.log(lat, lon);

    let result = []

    return this.centersList.
        filter(
          center => center.hasOwnProperty('coordinates')).
        map(
          center => this.distanceBetweenTwoPoints(lat, lon, center.coordinates.latitude, center.coordinates.longitude)
        ); // subscribe(val => result = val);
    // return this.distanceBetweenTwoPoints(lat_ref, lon_ref, lat, lon);
    // return result;
  }

  getUsersByRole(role: String) {
    return this.users
      .pipe(map(us => us.filter(user => user.roles.role === true)));
  }

  ngOnInit() {
    this.getRequestKeys();
    this.getStockKeys();
    this.getUserKeys();
    this.getCenters();
    console.log(this.centersList);
   // console.log(this.getRequestsData());
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
          
            this.centersList.push(e);
          
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

  completeRequest(index) {
    let reqId = this.requestKeys[index];
    let snapshot = this.db.object('requests/' + reqId).snapshotChanges().pipe(take(1));
    snapshot.subscribe(docSnapshot => {
      if (docSnapshot.key && !docSnapshot.payload.val()['finalized']) {
        console.log(docSnapshot.payload.val())
        let key = docSnapshot.payload.val()['bloodType'] + docSnapshot.payload.val()['rh']
        this.updateStock(key, -docSnapshot.payload.val()['quantity']);
        this.db.object('requests/' + reqId).update({
          finalized: true,
          recvQuantity: docSnapshot.payload.val()['quantity']
        });
      }});
  }

  sendBlood(index) {
    let quantity = this.qty[index];
    let reqId = this.requestKeys[index];
    let snapshot = this.db.object('requests/' + reqId).snapshotChanges().pipe(take(1));
    snapshot.subscribe(docSnapshot => {
      if (docSnapshot.key && !docSnapshot.payload.val()['finalized'] && quantity !== 0) {
        console.log(docSnapshot.payload.val())
        let key = docSnapshot.payload.val()['bloodType'] + docSnapshot.payload.val()['rh']
       
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
        this.qty[index] = 0;
        
      }});
  }
}
