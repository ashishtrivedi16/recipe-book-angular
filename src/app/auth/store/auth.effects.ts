import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth.service';
import * as AuthActions from './auth.actions';
import {HttpClient} from '@angular/common/http';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';
import {Router} from '@angular/router';
import {User} from '../user.model';


interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return AuthActions.authenticateSuccess({
    email,
    userId,
    token,
    expirationDate
  });
};

const handleError = (errorRes: any) => {
  let errorMessage = 'An error has occurred';
  if (!errorRes.error || !errorRes.error.error) {
    return of(AuthActions.authenticateFail({errorMessage}));
  }
  switch (errorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'Email already exists!';
      break;
    case 'OPERATION_NOT_ALLOWED':
      errorMessage = 'Password sign-in is disabled for this project';
      break;
    case 'TOO_MANY_ATTEMPTS_TRY_LATER':
      errorMessage = 'All requests from this device have been blocked due to unusual activity';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'Email not found! Please sign up first';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'Email or password is incorrect';
      break;
    case 'USER_DISABLED':
      errorMessage = 'This user account has been disabled by admin';
      break;
  }

  return of(AuthActions.authenticateFail({errorMessage}));
};


@Injectable()
export class AuthEffects {

  authSignup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      switchMap(authData => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          })
          .pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
              return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            }),
            catchError(errorRes => {
              return handleError(errorRes);
            })
          );
      })
    )
  );

  authLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(authData => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
          {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
          })
          .pipe(
            tap(resData => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map(resData => {
              return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
            }),
            catchError(errorRes => {
              return handleError(errorRes);
            })
          );
      })
    )
  );


  autoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      map(() => {

        const userData: {
          email: string,
          id: string,
          _token: string,
          _tokenExpirationDate: Date
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return {type: '[Auth] autoLogin$ Dummy action'};
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration * 1000);
          return AuthActions.authenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate)
          });
        }

        return {type: '[Auth] autoLogin$ Dummy action'};
      })
    )
  );

  authLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
      })
    ), {dispatch: false}
  );

  authRedirect$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.authenticateSuccess),
    tap(() => this.router.navigate(['/']))
    ), {dispatch: false}
  );

  constructor(private actions$: Actions,
              private authService: AuthService,
              private http: HttpClient,
              private router: Router) {
  }
}
