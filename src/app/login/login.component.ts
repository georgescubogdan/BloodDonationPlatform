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
  loginForm: FormGroup;
  
  submitted = false;
  
  get f() { return this.loginForm.controls; }
  
  constructor(private formBuilder: FormBuilder, private _authService: AuthService, private _router: Router, private db: AngularFireDatabase) { }
  
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  
  onSubmit() {
    this.submitted = true;
    
    // this._voiceListener.recognisedCommand.subscribe(a => {
    //   console.log("part command: " + a);
    //   // this.GetAnswer(a);
    // });
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this._authService.doLogin(this.f.username.value, this.f.password.value).then(result => 
      {console.log(result);
        this._authService.afAuth.authState.pipe().subscribe(state => {
          if (state != null) {
            this._authService.afAuth.authState.pipe().subscribe(userData => {
              this.db.object('users/' + userData.uid + '/roles').valueChanges().subscribe(
                roles => {
                  console.log(roles);
                  if (roles['doctor'] === true) {
                    console.log('doctor ' + roles['doctor']);

                    this._router.navigate(["/homedoctor"]);
                  } else if (roles['nurse'] === true) {
                    console.log('nurse ' + roles['nurse']);

                   this._router.navigate(["/homenurse"]); 
                  } else {
                    console.log('user ' + roles['user']);
                    this._router.navigate(["/home"]);
                  }
                }
                )
              })
            }
          })
          
        })
      }
    }
    