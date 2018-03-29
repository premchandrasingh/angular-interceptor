import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .mergeMap((event) => {
        if (event instanceof HttpResponse) {
          let _body = event.body;
          //console.info(`${event.url} - (${_body.status})`)

          if (_body && _body.status && (_body.status === 200 || _body.status === 401)) {
            let clonedEvent = event.clone({
              body: _body.payload
            });
            return Observable.of(clonedEvent);
          } else {
            return Observable.throw(_body.payload)
          }
        }

        return Observable.of(event);
      })

  }
}

