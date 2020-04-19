import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode = true;
  isLoading: boolean;
  error: string;
  storeSub$: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.storeSub$ = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  ngOnDestroy(): void {
    this.storeSub$.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleErrorMessage() {
    this.store.dispatch(AuthActions.clearError());
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.store.dispatch(AuthActions.loginStart({email, password}));
    } else {
      this.store.dispatch(AuthActions.signupStart({email, password}));
    }

    form.reset();
  }

}
