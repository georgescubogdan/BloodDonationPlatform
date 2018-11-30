import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  submitted = false;
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  
  constructor(private formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router, 
    private route: ActivatedRoute,
    private db: AngularFireDatabase) { }
    
    
    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
      
      // reset login status
      this._authService.signOut();
      
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    
    onSubmit() {
      this.submitted = true;
      
      // stop here if form is invalid
      if (this.loginForm.invalid) {
        return;
      }
      
      this.loading = true;
      this._authService.doLogin(this.f.email.value, this.f.password.value).then(result => 
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
      