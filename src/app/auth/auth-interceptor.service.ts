import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {exhaustMap, map, take} from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import {select, Store} from '@ngrx/store';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private store: Store<fromApp.AppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.pipe(
      select('auth'),
      take(1),
      map(authData => authData.user),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
        return next.handle(modifiedReq);
      })
    );
  }
}
