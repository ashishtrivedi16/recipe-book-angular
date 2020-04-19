import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit(): void {
    this.store.pipe(select('auth')).subscribe(authData => {
      this.isAuthenticated = !!authData.user;
    });
  }

  ngOnDestroy(): void {
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.store.dispatch(authActions.logout());
  }
}
