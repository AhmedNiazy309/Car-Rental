import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const ROLE_KEY = 'auth_role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  private readonly token = signal<string | null>(null);
  private readonly initialized = signal(false);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.token());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly isCustomer = computed(() => this.currentUser()?.role === 'customer');
  readonly role = computed(() => this.currentUser()?.role ?? null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t && u) {
        this.token.set(t);
        this.currentUser.set(JSON.parse(u));
      }
    } catch {
      this.clearStorage();
    }
    this.initialized.set(true);
  }

  getToken(): string | null {
    return this.token();
  }

  /** Login - tries customer first, then admin */
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/customer/login', data).pipe(
      tap(res => this.handleAuthSuccess(res)),
      catchError(err => {
        // If customer login fails with 401, try admin
        if (err.status === 401) {
          return this.http.post<AuthResponse>('/admin/login', data).pipe(
            tap(res => this.handleAuthSuccess(res))
          );
        }
        throw err;
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/customer/register', data).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  logout(): void {
    const role = this.currentUser()?.role;
    const endpoint = role === 'admin' ? '/admin/logout' : '/customer/logout';
    this.http.post(endpoint, {}).subscribe({
      complete: () => {},
      error: () => {}
    });
    this.clearStorage();
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  fetchCurrentUser(): Observable<User | null> {
    const role = this.currentUser()?.role;
    if (!this.token()) return of(null);
    const endpoint = role === 'admin' ? '/admin/me' : '/customer/me';
    return this.http.get<User>(endpoint).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.saveToStorage(this.token()!, user);
      }),
      catchError(() => {
        this.clearAuth();
        return of(null);
      })
    );
  }

  clearAuth(): void {
    this.clearStorage();
    this.token.set(null);
    this.currentUser.set(null);
  }

  getRedirectUrl(): string {
    const role = this.currentUser()?.role;
    if (role === 'admin') return '/admin/cars';
    return '/cars';
  }

  private handleAuthSuccess(res: AuthResponse): void {
    this.token.set(res.token);
    this.currentUser.set(res.user);
    this.saveToStorage(res.token, res.user);
  }

  private saveToStorage(token: string, user: User): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch { /* private mode */ }
  }

  private clearStorage(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(ROLE_KEY);
    } catch { /* private mode */ }
  }
}
