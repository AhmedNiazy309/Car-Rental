import { inject, Injectable, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

export type AppLang = 'en' | 'ar';

const LANG_KEY = 'app-lang';

@Injectable({ providedIn: 'root' })
export class LocaleRouteService {
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly lang = signal<AppLang>('en');

  constructor() {
    // 1. Read from URL first
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    let activeLang = this.getSavedLang();
    
    if (urlLang === 'en' || urlLang === 'ar') {
      activeLang = urlLang;
    }
    
    this.applyLang(activeLang);

    // Enforce URL sync if it was missing or loaded from cache
    if (urlLang !== activeLang) {
       setTimeout(() => {
         this.router.navigate([], {
           queryParams: { lang: activeLang },
           queryParamsHandling: 'merge',
           replaceUrl: true
         });
       }, 50);
    }
    
    // Fallback sync URL if changed via navigateToOtherLang
    this.route.queryParams.subscribe(params => {
      if (params['lang'] && (params['lang'] === 'en' || params['lang'] === 'ar')) {
        if (this.lang() !== params['lang']) {
          this.applyLang(params['lang'] as AppLang);
        }
      }
    });
  }

  navigateToOtherLang(): void {
    const next: AppLang = this.lang() === 'en' ? 'ar' : 'en';
    // Modifying the route query params explicitly changes the URL
    this.router.navigate([], {
      queryParams: { lang: next },
      queryParamsHandling: 'merge',
    });
    this.applyLang(next);
  }

  private applyLang(l: AppLang): void {
    this.lang.set(l);
    this.transloco.setActiveLang(l);
    document.documentElement.setAttribute('lang', l);
    document.body.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch { /* private mode */ }
  }

  private getSavedLang(): AppLang {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'en' || saved === 'ar') return saved;
    } catch { /* private mode */ }
    return 'en'; // default fallback
  }
}
