import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../services/auth.service';
import { LocaleRouteService } from '../services/locale-route.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive,
    TranslocoPipe, ButtonModule, ToastModule,
    ConfirmDialogModule, RippleModule, TooltipModule
  ],
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.css']
})
export class CustomerLayoutComponent {
  readonly auth = inject(AuthService);
  readonly locale = inject(LocaleRouteService);
  readonly theme = inject(ThemeService);
}
