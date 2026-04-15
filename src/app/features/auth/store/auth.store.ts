import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { AuthApi, LoginPayload } from '../data-access/auth.api';

interface AuthState {
  isSubmitting: boolean;
  isAuthenticated: boolean;
  userName: string | null;
}

const initialState: AuthState = {
  isSubmitting: false,
  isAuthenticated: false,
  userName: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, api = inject(AuthApi)) => ({
    login(payload: LoginPayload): void {
      patchState(store, { isSubmitting: true });
      api.login(payload).subscribe({
        next: (response) => {
          patchState(store, {
            isSubmitting: false,
            isAuthenticated: true,
            userName: response.userName
          });
        },
        error: () => {
          patchState(store, { isSubmitting: false });
        }
      });
    }
  }))
);
