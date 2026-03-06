import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private hasAccess = false;

  giveAccess(){
    this.hasAccess = true;
  }

  checkAccess(){
    return this.hasAccess;
  }
}
