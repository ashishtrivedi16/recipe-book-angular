import {NgModule} from '@angular/core';
import {AuthComponent} from './auth.component';
import {AuthRouteModule} from './auth-route.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    SharedModule,
    AuthRouteModule
  ],
  exports: [
    AuthComponent,
    AuthRouteModule
  ]
})
export class AuthModule {

}
