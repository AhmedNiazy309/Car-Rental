import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { AppPageHeaderComponent } from '../../../../shared/ui/app-page-header/app-page-header.component';
import { LocaleRouteService } from '../../../../core/services/locale-route.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { LoginFormComponent } from '../../ui/login-form/login-form.component';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    AppPageHeaderComponent,
    LoginFormComponent,
    RouterLink,
    TranslocoPipe,
    ButtonModule,
    RippleModule,
    ToolbarModule
  ],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  protected readonly locale = inject(LocaleRouteService);
  protected readonly theme = inject(ThemeService);
  readonly store = inject(AuthStore);
  readonly userName = computed(() => this.store.userName() ?? '-');

  onSubmit(payload: { email: string; password: string }): void {
    this.store.login(payload);
  }
}
