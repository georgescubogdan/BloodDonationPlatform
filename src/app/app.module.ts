import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { RouterModuleWrapper } from './router/router.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorizationService } from './authorization.service';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { NurseHomeComponent } from './nurse-home/nurse-home.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DoctorHomeComponent,
    UserHomeComponent,
    NurseHomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModuleWrapper,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    AuthorizationService,
    AuthService,
    AngularFireDatabase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
