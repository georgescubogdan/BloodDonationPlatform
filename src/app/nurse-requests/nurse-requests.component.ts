import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-nurse-requests',
  templateUrl: './nurse-requests.component.html',
  styleUrls: ['./nurse-requests.component.css']
})
export class NurseRequestsComponent implements OnInit {
  requests: Observable<any[]>;
  stocks: Observable<any[]>;
  requestKeys: any[] = [];
  stockKeys: any[] = [];
  req;
  public qty: number[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  constructor(private db: AngularFireDatabase) { 
    this.requests = this.db.list('requests/').valueChanges();
    this.stocks = this.db.list('stock/').valueChanges();
  }

  ngOnInit() {
    this.getRequestKeys();
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
