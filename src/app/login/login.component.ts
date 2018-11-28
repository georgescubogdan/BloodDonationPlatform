import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  submitted = false;
  
  
  constructor(private formBuilder: FormBuilder, private _authService: AuthService, private _router: Router, private db: AngularFireDatabase) { }
  
  ngOnInit() {
    
  }
  
  submit() {
    this.submitted = true;
    
    this._authService.doLogin(this.username, this.password).then(result => 
      {
        this._authService.afAuth.authState.pipe().subscribe(state => {
          if (!!state != false) {
            this._authService.afAuth.authState.pipe().subscribe(userData => {
              if (userData != null) {
                this.db.object('users/' + userData.uid + '/roles').valueChanges().subscribe(
                  roles => {
                    if (roles['doctor'] === true) {
                      this._router.navigate(["/doctor/home"]);
                    } else if (roles['nurse'] === true) {
                      this._router.navigate(["/nurse/home"]); 
                    } else {
                      this._router.navigate(["/user/home"]);
                    }
                  }
                  )
                }
              })
              
            }
          })
          
        })
      }
    }
    