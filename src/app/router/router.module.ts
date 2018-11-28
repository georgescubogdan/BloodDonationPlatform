import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoginComponent } from '../login/login.component';
import { DoctorHomeComponent } from '../doctor-home/doctor-home.component';
import { NurseHomeComponent } from '../nurse-home/nurse-home.component';
import { UserHomeComponent } from '../user-home/user-home.component';
import { DoctorGuard } from '../doctor.guard';
import { NurseGuard } from '../nurse.guard';
import { UserGuard } from '../user.guard';
import { RequestsComponent } from '../requests/requests.component';
import { DonationsComponent } from '../donations/donations.component';
import { FormComponent } from '../form/form.component';
import { ResultsComponent } from '../results/results.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { RequestComponent } from '../request/request.component';
import { DoctorSettingsComponent } from '../doctor-settings/doctor-settings.component';

const routes: Routes = [
  //{ path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'doctor/home', component: DoctorHomeComponent,  canActivate: [DoctorGuard] },
  { path: 'doctor/request', component: RequestComponent, canActivate: [DoctorGuard] },
  { path: 'doctor/requests', component: RequestsComponent, canActivate: [DoctorGuard] },
  { path: 'doctor/settings', component: DoctorSettingsComponent, canActivate: [DoctorGuard] },
  { path: 'nurse/home', component: NurseHomeComponent,  canActivate: [NurseGuard] },
  { path: 'nurse/donations', component: DonationsComponent,  canActivate: [NurseGuard] },
  { path: 'nurse/requests', component: NurseHomeComponent,  canActivate: [NurseGuard] },
  { path: 'user/home', component: UserHomeComponent,  canActivate: [UserGuard] },
  { path: 'user/donate', component: FormComponent,  canActivate: [UserGuard] },
  { path: 'user/results', component: ResultsComponent,  canActivate: [UserGuard] },
  { path: 'user/settings', component: UserSettingsComponent,  canActivate: [UserGuard] },
  { path: '**', redirectTo: 'login'}
  
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class RouterModuleWrapper { }
