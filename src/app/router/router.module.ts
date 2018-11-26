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

const routes: Routes = [
  //{ path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'homedoctor', component: DoctorHomeComponent,  canActivate: [DoctorGuard] },
  { path: 'homenurse', component: NurseHomeComponent,  canActivate: [NurseGuard] },
  { path: 'home', component: UserHomeComponent,  canActivate: [UserGuard] },
  { path: '**', redirectTo: 'login'}
 
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})
export class RouterModuleWrapper { }
