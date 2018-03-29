import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/member/list/list.component';
import { AddComponent } from './components/member/add/add.component';
import { AuthMemberGuardService } from './services/auth-member-guard.service';


const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'member',
    canActivate: [AuthMemberGuardService],
    component: ListComponent,
    children: [
      { path: 'add', component: AddComponent },
    ]
  }
];

export const RouterConfig = RouterModule.forRoot(appRoutes);
