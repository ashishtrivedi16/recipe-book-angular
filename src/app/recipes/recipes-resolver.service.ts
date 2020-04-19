import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Recipe} from './recipe.model';
import {of} from 'rxjs';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {map, switchMap, take} from 'rxjs/operators';
import * as recipeActions from './store/recipes.actions';
import {Actions, ofType} from '@ngrx/effects';

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<{ recipes: Recipe[] }> {
    constructor(private store: Store<fromApp.AppState>,
                private actions$: Actions) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select('recipes').pipe(
            take(1),
            map(recipeState => recipeState.recipes),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    this.store.dispatch(recipeActions.fecthRecipes());
                    return this.actions$.pipe(
                        ofType(recipeActions.setRecipes),
                        take(1)
                    );
                } else {
                    return of({recipes});
                }
            })
        );

        // return this.store.select('recipes').pipe(
        //   map(recipes => recipes.recipes),
        //   tap(recipes => {
        //     if (recipes.length === 0) {
        //       this.store.dispatch(recipeActions.fecthRecipes());
        //       return this.actions$.pipe(
        //         ofType(recipeActions.setRecipes),
        //         take(1)
        //       );
        //     } else {
        //       return {recipes};
        //     }
        //   })
        // );
    }
}
