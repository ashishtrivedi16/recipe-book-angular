import * as FromAuth from '../auth/store/auth.reducer';
import * as FromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as FromRecipes from '../recipes/store/recipes.reducer';

import {ActionReducerMap} from '@ngrx/store';

export interface AppState {
    shoppingList: FromShoppingList.State;
    auth: FromAuth.State;
    recipes: FromRecipes.State;
}

export const reducer: ActionReducerMap<AppState> = {
    shoppingList: FromShoppingList.shoppingListReducer,
    auth: FromAuth.authReducer,
    recipes: FromRecipes.recipeReducer
};
