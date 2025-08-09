import { Routes } from '@angular/router';
import { Login } from './auth/loginComponent/login';
import { Register } from './auth/registerComponent/register';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'login',
    component: Login,
  },
];
