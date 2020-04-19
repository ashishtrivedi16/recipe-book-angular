import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import * as recipeActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';

@Injectable()
export class RecipesEffects {

    fecthRecipes$ = createEffect(() => this.actions$.pipe(
        ofType(recipeActions.fecthRecipes),
        switchMap(() => {
            return this.http.get<Recipe[]>('https://recipe-book-fc8b3.firebaseio.com/recipes.json');
        }),
        map(recipes => {
            console.log(recipes);
            return recipes.map(recipe => {
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return recipeActions.setRecipes({recipes});
        })
    ));

    storeRecipes$ = createEffect(() => this.actions$.pipe(
        ofType(recipeActions.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipeState]) => {
            return this.http.put('https://recipe-book-fc8b3.firebaseio.com/recipes.json', recipeState.recipes);
        })
    ), {dispatch: false});

    constructor(private actions$: Actions,
                private http: HttpClient,
                private store: Store<fromApp.AppState>) {
    }

}
