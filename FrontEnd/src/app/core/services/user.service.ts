import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authToken = "";

  constructor(private httpClient: HttpClient, private router: Router){}

  createUser(username: string, password: string, email: string, phoneNumber: string ){
    return this.httpClient.post<{email:string, username: string, phoneNumber: string, password: string}>
    ("http://localhost:8080/user",
      {username, password, phoneNumber, email})
  }

  login(email: string, password: string) {
    return this.httpClient.post<{token: string}>(
      "http://localhost:8080/login",
      { email, password },
    ).pipe(
      tap(response => {
        this.authToken = response.token;
        localStorage.setItem('token', response.token);

        // Decode JWT and store userId
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        localStorage.setItem('userId', payload.sub);
        localStorage.setItem('email', payload.email);
      })
    );
  }

  getAuthToken(){
    return this.authToken;
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

}
