import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private authToken = "";

  constructor(private httpClient: HttpClient, private router: Router){}

  registerUser(username: string, password: string){
    this.httpClient.post<{id:string, username: string, password: string}>("http://localhost:8080/user",{username, password}).subscribe({
      next: response => alert(`account registered with username ${response.username}`),
      error: error => alert("something went wrong registering, please try again")
    });
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
