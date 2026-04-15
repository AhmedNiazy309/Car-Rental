import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../../../core/services/admin.service';
import { ApiError } from '../../../../core/models';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink, TranslocoPipe,
    ButtonModule, InputTextModule, InputNumberModule, CardModule, MessageModule
  ],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly adminService = inject(AdminService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  readonly isEdit = signal(false);
  readonly loading = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string[]>>({});
  private carId = 0;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    kilometers: [0 as number, Validators.required],
    price_per_day: [0 as number, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.carId = Number(id);
      this.adminService.getCar(this.carId).subscribe({
        next: (car) => {
          this.form.patchValue({
            name: car.name,
            brand: car.brand,
            model: car.model,
            kilometers: car.kilometers,
            price_per_day: parseFloat(car.price_per_day)
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.serverError.set(null);
    this.fieldErrors.set({});

    const data = this.form.getRawValue();
    const obs = this.isEdit()
      ? this.adminService.updateCar(this.carId, data)
      : this.adminService.createCar(data);

    obs.subscribe({
      next: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: this.transloco.translate('messages.success'),
          detail: this.isEdit() ? this.transloco.translate('messages.carUpdated') : this.transloco.translate('messages.carCreated')
        });
        this.router.navigate(['/admin/cars']);
      },
      error: (err) => {
        this.loading.set(false);
        const body = err.error as ApiError;
        if (err.status === 422 && body?.errors) this.fieldErrors.set(body.errors);
        this.serverError.set(body?.message || this.transloco.translate('messages.operationFailed'));
      }
    });
  }
}
