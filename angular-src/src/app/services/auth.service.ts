import { AuthGuard } from './../guards/auth.guard';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
// import {tokenNotExpired} from 'angular-jwt';
import { mergeMap } from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { from } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: any;
  user: any;
  postid: any;
 helper = new JwtHelperService();
  constructor(private http: HttpClient ) { }
// , private jwtHelper: JwtHelperService
  registerUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:3000/users/register', user, {headers} );


      // .pipe(map(res => res.json()));
     // .map(res => res.json());
  }

  authenticateUser(user) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:3000/users/authenticate', user, {headers}) ;
     // .pipe(map(res => res.json()));
     //  .map(res => res.json());
  }


  getProfile() {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get<any>('users/profile', {headers});
      // .map(res => res.json());
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  storeUserData(token, user) {
    // token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


  loggedIn() {
  this.loadToken();
    // return this.helper.isTokenExpired('id_token');
  return this.helper.isTokenExpired(this.authToken);
}


  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

}
