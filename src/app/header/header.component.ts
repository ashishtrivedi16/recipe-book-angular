import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as authActions from '../auth/store/auth.actions';
import * as recipeActions from '../recipes/store/recipes.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    isAuthenticated = false;

    constructor(private store: Store<fromApp.AppState>) {
    }

    ngOnInit(): void {
        this.store.pipe(select('auth')).subscribe(authData => {
            this.isAuthenticated = !!authData.user;
        });
    }

    ngOnDestroy(): void {
    }

    onSaveData() {
        this.store.dispatch(recipeActions.storeRecipes());
    }

    onFetchData() {
        this.store.dispatch(recipeActions.fecthRecipes());
    }

    onLogout() {
        this.store.dispatch(authActions.logout());
    }
}
