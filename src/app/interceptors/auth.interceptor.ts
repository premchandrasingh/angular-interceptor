import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let cloneReq = req.clone({
      url: environment.BASE_URL + req.url
    });

    if (cloneReq.url.indexOf('/token') === -1) {
      const authToken = this._getToken();

      if (authToken) {
        cloneReq = cloneReq.clone({
          headers: req.headers.set('Authorization', `Bearer ${authToken.access_token}`)
        });
        return next.handle(cloneReq);
      }
    }
    return next.handle(cloneReq);
  }

  _getToken() {
    if (localStorage.getItem("token"))
      return JSON.parse(localStorage.getItem("token"));

    return null;

  }

}

