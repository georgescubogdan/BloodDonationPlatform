import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { NgForm, FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
const wait = (ms) => new Promise(res => setTimeout(res, ms));

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  types = ['A', 'B', 'O', 'AB'];
  rhs = ['+', '-'];
  canDonate = false;
  formCompleted = false;
  diseases: string[] = [];
  otherRestrictions: string[] = [];
  donationForm: FormGroup;

  constructor(
    public afAuth: AngularFireAuth, 
    private db: AngularFireDatabase, 
    private router: Router, 
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.donationForm = this.formBuilder.group({
      age: ['', Validators.required],
      weight: ['', Validators.required],
      gender: ['', Validators.required],
      bloodType: ['', Validators.required],
      rh: ['', Validators.required]
    });
  }

  get f() { return this.donationForm.controls; }

  isEligible() {
    console.log(this.f.weight.value);

    if (parseInt(this.f.weight.value) < 50) {
      return false;
    } else if (parseInt(this.f.age.value) < 18 ) {
      return false;
    } else if (this.diseases.length != 0) {
      return false;
    } else if (this.otherRestrictions.length != 0) {
      return false;
    }

    return true;
  }

  submit() {
    this.canDonate = this.isEligible();
    this.formCompleted = true;
  }

  async donate() {
    let uid = this.afAuth.auth.currentUser.uid;
    console.log('donations/' + uid + '/');
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    let date = mm + '/' + dd + '/' + yyyy;

    let myData = {};

    let stockSnapshot = this.db.object('users/' + uid).snapshotChanges().pipe(take(1));
    stockSnapshot.subscribe(docSnapshot => {
      if (docSnapshot['key']) {
        let o = docSnapshot.payload.val();
        // console.log(o);
        myData = o;
      }});
    await wait(100);

    console.log(myData);

    let data = {
      date: date,
      pending: true,
      firstName: myData['firstName'],
      lastName: myData['lastName'],
      group: myData['group'],
      rh: myData['rh'],
    }
    this.db.list('donations/' + uid + '/').push(data);
    this.router.navigate(['/user/results']);
  }

  toggleDisease(disease: string) {
    let index = this.diseases.indexOf(disease);
    
    if (index == -1) {
      this.diseases.push(disease);
    } else {
      this.diseases.splice(index, 1);
    }
  }

  addRestriction(restriction: string) {
    let index = this.otherRestrictions.indexOf(restriction);
  
    if (index == -1) {
      this.otherRestrictions.push(restriction);
    } 
  }

  removeRestriction(restriction: string) {
    let index = this.otherRestrictions.indexOf(restriction);
  
    if (index != -1) {
      this.otherRestrictions.splice(index, 1);
    } 
  }
}
