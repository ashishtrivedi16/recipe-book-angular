import {createAction, props} from '@ngrx/store';
import {Recipe} from '../recipe.model';

// export const getRecipes = createAction(
//   '[Recipes] Get Recipes',
// );

export const addRecipe = createAction(
    '[Recipes] Add recipe',
    props<{ newRecipe: Recipe }>()
);

export const setRecipes = createAction(
    '[Recipes] Set recipes',
    props<{ recipes: Recipe[] }>()
);

export const updateRecipe = createAction(
    '[Recipes] Update recipe',
    props<{ index: number, newRecipe: Recipe }>()
);

export const deleteRecipe = createAction(
    '[Recipes] Delete recipe',
    props<{ index: number }>()
);

export const storeRecipes = createAction(
    '[Recipes] Store recipes on firebase'
);

export const fecthRecipes = createAction(
    '[Recipes] Fetch recipes from firebase'
);


