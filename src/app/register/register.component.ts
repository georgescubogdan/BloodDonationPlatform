import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../login/login.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService) { }
    // roles : string[] = ['user', 'doctor', 'nurse'];
    roles = [{'id': 'user', 'name':'User'}, {'id':'doctor', 'name': 'Doctor'}, {'id':'nurse', 'name': 'Nurse'}];
    ngOnInit() {
      this.registerForm = this.formBuilder.group({
        email: ['', [Validators.email, Validators.required]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['', Validators.required]
      });
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }
    
    onSubmit() {
      this.submitted = true;
      
      // stop here if form is invalid
      if (this.registerForm.invalid) {
        return;
      }
      
      this.loading = true;
      this.auth.doRegister(this.registerForm.value).then(e =>
        {
          console.log('merge')
          // this.auth.doLogin(this.registerForm.value.email, this.registerForm.value.password)
          this.router.navigate(["/login"]);
        }
        );
        
      }
      
    }
    