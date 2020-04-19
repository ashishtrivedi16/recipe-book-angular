import {createAction, props} from '@ngrx/store';
import {Ingredient} from '../../shared/ingredient.model';

export const addIngredient = createAction(
    '[Shopping-List] Add ingredient',
    props<{ ingredient: Ingredient }>()
);

export const addIngredients = createAction(
    '[Shopping-List] Add ingredients',
    props<{ ingredients: Ingredient[] }>()
);

export const updateIngredient = createAction(
    '[Shopping-List] Update ingredients',
    props<{ ingredient: Ingredient }>()
);

export const deleteIngredient = createAction(
    '[Shopping-List] Delete ingredients'
);

export const startedEditing = createAction(
    '[Shopping-List] Started editing',
    props<{ editIndex: number }>()
);

export const stopEditing = createAction(
    '[Shopping-List] Stopped editing'
);
