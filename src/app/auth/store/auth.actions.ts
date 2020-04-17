import {createAction} from '@ngrx/store';

export const login = createAction(
  '[Auth] login'
);
export const logout = createAction(
  '[Auth] logout'
);
