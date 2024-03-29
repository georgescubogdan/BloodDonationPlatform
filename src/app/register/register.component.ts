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
  additionalData: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthService) { }
    // roles : string[] = ['user', 'doctor', 'nurse'];
    roles = [{'id': 'user', 'name':'User'}, {'id':'doctor', 'name': 'Doctor'}, {'id':'nurse', 'name': 'Nurse'}];
    groups = [{'id': 'A', 'name':'A'}, {'id':'B', 'name': 'B'}, {'id':'O', 'name': 'O'}, {'id':'AB', 'name': 'AB'}];
    rhs = [{'id': '+', 'name':'+'}, {'id':'-', 'name': '-'}];

    ngOnInit() {
      this.registerForm = this.formBuilder.group({
        email: ['', [Validators.email, Validators.required]],
        firstName: ['', Validators.required],
        address: [''],
        coordinates: [''],
        lastName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['', Validators.required],
        group: ['', Validators.required],
        rh: ['', Validators.required]
      });
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }
    
    onSubmit() {
      this.submitted = true;
      console.log("intra")
      // stop here if form is invalid
      if (this.registerForm.invalid) {
        return;
      }
      
      this.loading = true;
      this.auth.doRegister(this.registerForm.value, this.additionalData).then(e =>
        {
          console.log('merge')
          // this.auth.doLogin(this.registerForm.value.email, this.registerForm.value.password)
          this.router.navigate(["/login"]);
        }
        );
        
      }

      onAutocompleteSelected(event) {
        //console.log(event);
      }

      onLocationSelected(coordinates) {
        console.log(coordinates);
        this.additionalData = coordinates;
      }
      
    }
    