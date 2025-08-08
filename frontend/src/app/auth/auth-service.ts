import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiURL = 'http://localhost:3001/user';

  constructor(private http: HttpClient) {}

  registerUser(userData: User): Observable<User> {
    return this.http.post<User>(
      'http://localhost:3001/user/register',
      userData
    );
  }

  loginUser(userData: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      'http://localhost:3001/user/login',
      userData
    );
  }
}
