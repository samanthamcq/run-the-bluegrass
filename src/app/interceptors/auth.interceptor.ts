import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { concatMap } from 'rxjs/operators';
import Auth from '@aws-amplify/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.getUserIdToken().pipe(
      concatMap((token: string | string[]) => {
        const modifiedReq = req.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            Authorization: token
          }
        });
        return next.handle(modifiedReq);
      }));
  }

  getUserIdToken(): Observable<string> {
    return new Observable(observer => {
      Auth.currentSession()
        .then((session: any) => {
          observer.next(session.getIdToken().getJwtToken());
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
  }
}
