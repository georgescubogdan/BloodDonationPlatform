import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import {MatInputModule} from '@angular/material';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {
  users: Observable<any[]>;
  centers: Observable<any[]>;
  userKeys : any[] = [];
  centerKeys : any[] = [];
  additionalData: any;

  constructor(private formBuilder: FormBuilder, private db: AngularFireDatabase) { 
    this.users = this.db.list('users/', ref => ref.orderByChild('approved')).valueChanges();
    this.centers = this.db.list('centers/').valueChanges();
  }
  
  mockCenter1 = {
    name: 'C1'
  }
  mockCenter2 = {
    name: 'C2'
  }
  mockCenter3 = {
    name: 'C3'
  }
  
  keys : any[] = [];

addCenterForm: FormGroup
  ngOnInit() {
    this.addCenterForm = this.formBuilder.group({
      name: ['', Validators.required],
      coordinates: ['']
    });
    this.getUserKeys();
    this.getCenterKeys();
    // //adds 3 centers for testing purposes
    // this.addCenter(this.mockCenter1)
    // this.addCenter(this.mockCenter2)
    // this.addCenter(this.mockCenter3)
    // console.log(this.centerKeys)
    // console.log(this.centers);
  }
  onLocationSelected(coordinates) {
    console.log(coordinates);
    this.additionalData = coordinates;
  }
  getUserKeys() {
    return this.db.list('users/', ref => ref.orderByChild('approved'))
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.userKeys.includes(e.key)) {
            this.userKeys.push(e.key);
          }
        });
      })
  }
   
  getCenterKeys() {
    return this.db.list('centers/')
    .snapshotChanges().subscribe(
      snapshot => {
        snapshot.forEach(e => {
          if (!this.centerKeys.includes(e.key)) {
            this.centerKeys.push(e.key);
          }
        });
      })
  }
  approveUser(index) {
      let userId = this.userKeys[index];
      this.db.object('users/' + userId).snapshotChanges().subscribe(docSnapshot => {
        if (docSnapshot.key) {
          this.db.list('users/').update(userId, {
            approved: true
          });
        }});
  }
    deleteCenter(index) {
      let centerId = this.centerKeys[index];
      this.db.object('centers/' + centerId).snapshotChanges().subscribe(docSnapshot => {
        if (docSnapshot.key) {
          this.db.list('centers/').remove(centerId).then(
            e => {
          this.centerKeys = [];
          this.getCenterKeys()
          console.log(this.centerKeys);
            }
          )
        }});
    }

    addCenter(data) {
      this.db.list('centers/').push(data).then(
        e => {
          this.centerKeys = [];
          this.getCenterKeys()
          console.log(this.centerKeys);
            }
      )
    }

    onSubmit() {
      if (this.addCenterForm.valid)
      {
        let newCenter = this.addCenterForm.value;
        newCenter.coordinates = this.additionalData;
        
        this.addCenter(newCenter);
      }
    }
    
    clearDonations() {
      return this.db.list('donations/')
      .snapshotChanges().subscribe(
        snapshot => {
          snapshot.forEach(e => {
            let idDonation = e.key;
            this.db.object('donations/' + idDonation).snapshotChanges().subscribe(docSnapshot => {
              if (docSnapshot.key) {
                this.db.list('donations/').remove(idDonation)
                
              }});
          });
        })
    }
    
    clearRequests() {
      return this.db.list('requests/')
      .snapshotChanges().subscribe(
        snapshot => {
          snapshot.forEach(e => {
            let idReq = e.key;
            this.db.object('requests/' + idReq).snapshotChanges().subscribe(docSnapshot => {
              if (docSnapshot.key) {
                this.db.list('requests/').remove(idReq)
              }});
          });
        })
    }
  }
