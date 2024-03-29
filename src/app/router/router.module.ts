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
import { NurseDonationsComponent } from '../donations/donations.component';
import { FormComponent } from '../form/form.component';
import { ResultsComponent } from '../results/results.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { RequestComponent } from '../request/request.component';
import { DoctorSettingsComponent } from '../doctor-settings/doctor-settings.component';
import { NurseRequestsComponent } from '../nurse-requests/nurse-requests.component';
import { RegisterComponent } from '../register/register.component';
import { HomeAdminComponent } from '../home-admin/home-admin.component';
import { HomeComponent } from '../home/home.component';
import { AdminGuard } from '../admin.guard';

const routes: Routes = [
  //{ path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin/users', component: HomeAdminComponent, canActivate: [AdminGuard]},
  { path: 'doctor/home', component: DoctorHomeComponent,  canActivate: [DoctorGuard] },
  { path: 'doctor/request', component: RequestComponent, canActivate: [DoctorGuard] },
  { path: 'doctor/requests', component: RequestsComponent, canActivate: [DoctorGuard] },
  { path: 'doctor/settings', component: DoctorSettingsComponent, canActivate: [DoctorGuard] },
  { path: 'nurse/stocks', component: NurseHomeComponent,  canActivate: [NurseGuard] },
  { path: 'nurse/donations', component: NurseDonationsComponent,  canActivate: [NurseGuard] },
  { path: 'nurse/requests', component: NurseRequestsComponent,  canActivate: [NurseGuard] },
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
