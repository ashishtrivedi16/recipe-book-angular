import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import {map, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private store: Store<fromApp.AppState>) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean | UrlTree> {

        return this.store.pipe(
            select('auth'),
            take(1),
            map(authData => authData.user),
            map(user => {
                if (!!user) {
                    return true;
                } else {
                    return this.router.createUrlTree(['/auth']);
                }
            })
        );
    }


}
