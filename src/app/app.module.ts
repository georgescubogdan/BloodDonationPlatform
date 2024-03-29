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
import { FormComponent } from './form/form.component';
import { ResultsComponent } from './results/results.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestComponent } from './request/request.component';
import { DoctorSettingsComponent } from './doctor-settings/doctor-settings.component';
import { NurseDonationsComponent } from './donations/donations.component';
import { NurseRequestsComponent } from './nurse-requests/nurse-requests.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import {AgmCoreModule} from '@agm/core';
import { MessagingService } from './messaging.service';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DoctorHomeComponent,
    UserHomeComponent,
    NurseHomeComponent,
    FormComponent,
    ResultsComponent,
    UserSettingsComponent,
    RequestsComponent,
    RequestComponent,
    DoctorSettingsComponent,
    NurseDonationsComponent,
    NurseRequestsComponent,
    HomeAdminComponent,
    RegisterComponent,
    HomeComponent
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
    MatGoogleMapsAutocompleteModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAyfjHiYM9wOoWxCHaTVv5nabpxoAqaLhM',
      libraries: ['geometry', 'places'],
      language: 'en',
  }) 
    
  ],
  providers: [
    AuthorizationService,
    AuthService,
    AngularFireDatabase,
    MessagingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
