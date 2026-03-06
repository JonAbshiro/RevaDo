import {Routes} from '@angular/router';
import {LoginComponent} from './features/login/login.component';
import {CreateUserComponent} from './features/create-user/create-user.component';
import {Home} from './features/home/home';
import {authGuard} from './guards/auth-guard';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'create-user', component: CreateUserComponent},
  {path: 'home', component: Home, canActivate: [authGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];
