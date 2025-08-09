import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User, RegisterResponse, LoginResponse } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiURL = 'http://localhost:3001/user';
  private http = inject(HttpClient);

  registerUser(userData: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      this.apiURL + '/register',
      userData
    );
  }

  loginUser(userData: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiURL + '/login', userData);
  }
}
