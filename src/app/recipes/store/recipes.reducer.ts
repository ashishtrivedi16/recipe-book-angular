import {Action, createReducer, on} from '@ngrx/store';
import {Recipe} from '../recipe.model';
import * as recipeActions from './recipes.actions';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

const reducer = createReducer(
    initialState,
    on(recipeActions.addRecipe, (state, action) => ({
        ...state,
        recipes: state.recipes.concat(action.newRecipe)
    })),
    on(recipeActions.setRecipes, (state, action) => ({
        ...state,
        recipes: [...action.recipes]
    })),
    on(recipeActions.updateRecipe, (state, action) => ({
        ...state,
        recipes: state.recipes.map((recipe, index) => index === action.index ? {...action.newRecipe} : recipe)
    })),
    on(recipeActions.deleteRecipe, (state, action) => ({
        ...state,
        recipes: state.recipes.filter((recipe, index) => index !== action.index)
    }))
);

export function recipeReducer(recipeState = initialState, recipeAction: Action) {
    return reducer(recipeState, recipeAction);
}
