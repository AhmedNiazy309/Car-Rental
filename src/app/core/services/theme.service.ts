import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(false);

  constructor() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    if (localStorage.getItem(STORAGE_KEY) === 'dark') {
      this.isDark.set(true);
      document.documentElement.classList.add('app-dark');
    }
  }

  toggle(): void {
    this.isDark.update((v) => !v);
    const on = this.isDark();
    document.documentElement.classList.toggle('app-dark', on);
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'dark' : 'light');
    } catch {
      /* private mode / quota */
    }
  }
}
