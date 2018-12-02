import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  newRequestForm: FormGroup
  types = ['A', 'B', 'O', 'AB'];
  rhs = ['+', '-'];
  units = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  constructor(private formBuilder: FormBuilder, private db: AngularFireDatabase, private router: Router) { }

  ngOnInit() {
    this.newRequestForm = this.formBuilder.group({
      name: ['', Validators.required],
      bloodType: ['', Validators.required],
      rh: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  newRequest(data) {
    this.db.list('requests/').push(data);
  }

  onSubmit() {
    if (this.newRequestForm.valid)
    {
      let data = this.newRequestForm.value;
      data.recvQuantity = 0;
      data.finalized = false;
      this.newRequest(data);
      this.router.navigate(["/doctor/requests"]);
    }
  }

}
