import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponseData, AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string = null;
  // @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  // private closeSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }


  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onHandleErrorMessage() {
    this.error = null;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(resData => {
      console.log(resData);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      // this.showErrorAlert(errorMessage);
      this.isLoading = false;
    });

    form.reset();
  }

  // private showErrorAlert(errorMessage: string) {
  //   const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
  //   const hostViewContainerRef = this.alertHost.viewContainerRef;
  //   hostViewContainerRef.clear();
  //
  //   const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
  //   componentRef.instance.message = errorMessage;
  //   this.closeSub = componentRef.instance.close.subscribe(() => {
  //     this.closeSub.unsubscribe();
  //     hostViewContainerRef.clear();
  //   });
  // }

}
