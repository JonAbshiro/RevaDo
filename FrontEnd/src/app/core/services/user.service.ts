import { Injectable } from '@angular/core';
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

  login(username: string, password: string) {
    return this.httpClient.post<{token: string}>(
      "http://localhost:8080/login",
      { username, password },
    );
  }

  getAuthToken(){
    return this.authToken;
  }

}
