import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  requests: Observable<any[]>;
  requestKeys: any[] = [];
  constructor(private db: AngularFireDatabase) { 
    this.requests = this.db.list('requests/', ref => ref.orderByChild('finalized')).valueChanges();
  }

  ngOnInit() {
    this.getRequestKeys();
  }

  getRequestKeys() {
    return this.db.list('requests/', ref => ref.orderByChild('finalized'))
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.requestKeys.includes(e.key)) {
            this.requestKeys.push(e.key);
          }
        });
      })
  }

  getColor(priority) { 
    switch (priority) {
      case 1:
        return 'yellow';
      case 2:
        return 'orange';
      case 3:
        return 'red';
    }
  }
}
