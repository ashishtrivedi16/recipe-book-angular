import {Ingredient} from '../../shared/ingredient.model';
import {Action, createReducer, on} from '@ngrx/store';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

export interface State {
    ingredients: Ingredient[];
    editIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('noodle', 5),
        new Ingredient('tomato', 10),
    ],
    editIndex: -1
};

const reducer = createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, action) => ({
            ...state,
            ingredients: state.ingredients.concat(action.ingredient)
        })
    ),
    on(ShoppingListActions.addIngredients, (state, action) => ({
        ...state,
        ingredients: state.ingredients.concat(action.ingredients)
    })),
    on(ShoppingListActions.updateIngredient, (state, action) => ({
        ...state,
        editIndex: -1,
        ingredients: state.ingredients.map(
            (ingredient, index) => index === state.editIndex ? action.ingredient : ingredient
        )
    })),
    on(ShoppingListActions.deleteIngredient, (state) => ({
        ...state,
        editIndex: -1,
        ingredients: state.ingredients.filter(
            (ingredient, index) => index !== state.editIndex
        )
    })),
    on(ShoppingListActions.startedEditing, (state, action) => ({
        ...state,
        editIndex: action.editIndex
    })),
    on(ShoppingListActions.stopEditing, (state) => ({
        ...state,
        editIndex: -1
    }))
);

export function shoppingListReducer(shoppingListState: State | undefined, shoppingListAction: Action) {
    return reducer(shoppingListState, shoppingListAction);
}
