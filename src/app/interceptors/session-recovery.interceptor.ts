import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { Service } from '../services/service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import { environment } from '../../environments/environment';


@Injectable()
export class SessionRecoveryInterceptor implements HttpInterceptor {
  private Service: Service;
  constructor(
    private injector: Injector,
    private http: Http,
    private router: Router
  ) {

    setTimeout(() => {
      //this.Service = this.injector.get(Service);
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler, modified = false): Observable<HttpEvent<any>> {
    this.Service = this.injector.get(Service);

    return next.handle(req)
      .mergeMap((event) => {
        if (event instanceof HttpResponse) {
          let _body = event.body;
          if (_body && _body.status && _body.status === 401) {
            return this.Service.RefreshToken()
              .do(null, err => {
                this.router.navigate(['login']);
              })
              .mergeMap(refreshedToken => {
                return next.handle(this.updateHeader(req));
              });
          }
        }
        return Observable.of(event);
      })
  }

  updateHeader(req) {
    const authToken = this.Service.getToken();
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken.access_token}`)
    });
    return req;
  }

}

