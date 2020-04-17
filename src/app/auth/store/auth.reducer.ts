import {Action, createReducer} from '@ngrx/store';
import {User} from '../user.model';

export interface State {
  user: User;
}

const initialState: State = {
  user: null
};

const reducer = createReducer(
  initialState
);

export function authReducer(authState = initialState, authActions: Action) {
  return reducer(authState, authActions);
}
