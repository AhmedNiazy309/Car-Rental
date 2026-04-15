import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe, ButtonModule, CardModule, FloatLabelModule, InputTextModule, PasswordModule],
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  readonly submitted = output<{ email: string; password: string }>();
  private readonly fb = new FormBuilder().nonNullable;

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    this.form.markAllAsTouched();
    const result = loginSchema.safeParse(this.form.getRawValue());
    if (!result.success) {
      return;
    }

    this.submitted.emit(result.data);
  }
}
