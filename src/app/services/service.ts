import { Component, OnInit, EventEmitter, Input, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';


@Injectable()
export class Service {

  private event: EventEmitter<any> = new EventEmitter<any>()
  private eventObservable: Observable<any>;
  private refreshTokenObservable: Observable<any> = null;

  constructor(private http: HttpClient) {

  }

  Login(username, password): any {
    return this.http.post('/token', { username: username, password: password, grant_type: 'password' })
      .do(data => {
        console.log(data);
        localStorage.setItem('token', JSON.stringify(data));
        this.getBridge().emit({ type: "LOGGED_IN" })
      }, (err: any) => {
        console.log(err);
        return err;
      })
  }

  Logout() {
    return Observable.of('LOGOUT')
      .do(() => {
        this.removeToken();
        this.getBridge().emit({ type: "LOGGED_OUT" })
      })

  }


  RefreshToken() {
    if (this.refreshTokenObservable){
      return this.refreshTokenObservable;
    }

    this.refreshTokenObservable = this.http.post('/token', { refresh_token: this.getToken().refresh_token, grant_type: 'refresh_token' })
    // cold & hot observables. publish() operator convert cold observable to hot operator https://www.youtube.com/watch?v=rmJ-cAMct74
    this.refreshTokenObservable = this.refreshTokenObservable.share();

    return this.refreshTokenObservable
    .do((data) => {
      localStorage.setItem('token', JSON.stringify(data));
      this.refreshTokenObservable = null;
      //throw new Error("explicit refresh failed")
    }, err => {
      this.refreshTokenObservable = null;
    });
  }

  IsAuthenticated() {
    return !!this.getToken() && this.getToken().access_token;
  }

  SampleCall() {
    return this.http.get('/samplecall');
  }

  SampleCall2() {
    return this.http.get('/samplecall2');
  }

  getToken() {
    if (localStorage.getItem("token"))
      return JSON.parse(localStorage.getItem("token"));
    return null;
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  setToken(data) {
    localStorage.setItem('token', data);
  }

  /**
   * This method will return a centralize event emiter object to communicate inter-service or inter-component etc
   */
  getBridge() {
    return this.event;
  }

  getTokenRemainingLife() {
    const token = this.getToken();
    if (!token)
      return 0;

    let acc_token = token.access_token;
    acc_token = JSON.parse(atob(acc_token.split('.')[1]));
    var iat = new Date(acc_token.iat * 1000);
    var exp = new Date(acc_token.exp * 1000);
    //console.log('Issued at ', iat, ' Expired at ', exp);

    if (Date.now() > acc_token.exp * 1000)
      return 0;

    return Math.ceil(((acc_token.exp * 1000) - Date.now()) / 1000);

  }

}
