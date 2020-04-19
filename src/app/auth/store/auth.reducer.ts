import {Action, createReducer, on} from '@ngrx/store';
import {User} from '../user.model';
import * as authActions from './auth.actions';

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
};

const reducer = createReducer(
    initialState,
    on(authActions.loginStart, authActions.signupStart, (state) => ({
        ...state,
        loading: true
    })),
    on(authActions.authenticateSuccess, (state, action) => ({
        ...state,
        authError: null,
        loading: false,
        user: new User(action.email, action.userId, action.token, action.expirationDate)
    })),
    on(authActions.authenticateFail, (state, action) => ({
        ...state,
        authError: action.errorMessage,
        loading: false
    })),
    on(authActions.clearError, state => ({
        ...state,
        authError: null
    })),
    on(authActions.logout, state => ({
        ...state,
        user: null
    }))
);

export function authReducer(authState = initialState, authAction: Action) {
    return reducer(authState, authAction);
}
