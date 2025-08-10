import { Routes } from '@angular/router';
import { Login } from './auth/loginComponent/login';
import { Register } from './auth/registerComponent/register';
import { TodoPageComponent } from './todo/todo-page-component/todo-page-component';

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
  {
    path: 'todo',
    component: TodoPageComponent,
  },
];
