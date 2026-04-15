import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApi {
  login(payload: LoginPayload): Observable<{ token: string; userName: string }> {
    return of({ token: 'demo-token', userName: payload.email });
  }
}
