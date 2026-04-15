import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { CustomerService } from '../../../../core/services/customer.service';
import { Car, ApiError } from '../../../../core/models';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, TranslocoPipe,
    ButtonModule, CardModule, SelectModule, DatePickerModule,
    InputTextModule, InputNumberModule, MessageModule
  ],
  providers: [DatePipe],
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css']
})
export class OrderCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly datePipe = inject(DatePipe);
  private readonly transloco = inject(TranslocoService);

  readonly minDate = new Date();
  readonly selectedCar = signal<Car | null>(null);
  readonly loading = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly fieldErrors = signal<Record<string, string[]>>({});

  get paymentTypeOptions() {
    return [
      { label: this.transloco.translate('payment.visa'), value: 'visa' },
      { label: this.transloco.translate('payment.tamara'), value: 'tamara' },
      { label: this.transloco.translate('payment.cash'), value: 'cash' }
    ];
  }
  
  get orderTypeOptions() {
    return [
      { label: this.transloco.translate('payment.fullPayment'), value: 'full' },
      { label: this.transloco.translate('payment.installments'), value: 'installments' }
    ];
  }

  readonly form = this.fb.group({
    car_id: [null as number | null, Validators.required],
    receiving_date: [null as Date | null, Validators.required],
    delivery_date: [null as Date | null, Validators.required],
    payment_type: ['visa', Validators.required],
    order_type: ['full', Validators.required],
    down_payment: [0],
    number_of_installments: [1]
  });

  constructor() {
    effect(() => {
      const type = this.form.get('order_type')?.value;
      const dpControl = this.form.get('down_payment');
      const niControl = this.form.get('number_of_installments');
      
      if (type === 'installments') {
        dpControl?.setValidators([Validators.required]);
        niControl?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        dpControl?.clearValidators();
        niControl?.clearValidators();
      }
      dpControl?.updateValueAndValidity();
      niControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    const carId = this.route.snapshot.queryParamMap.get('car_id');
    if (carId) {
      this.form.patchValue({ car_id: Number(carId) });
      this.onCarIdChange();
    }
  }

  onCarIdChange(): void {
    const id = this.form.get('car_id')?.value;
    if (id) {
      this.customerService.getCar(id).subscribe({
        next: (car) => this.selectedCar.set(car),
        error: () => this.selectedCar.set(null)
      });
    } else {
      this.selectedCar.set(null);
    }
  }

  calculateEstimatedDays(): number {
    const r = this.form.get('receiving_date')?.value;
    const d = this.form.get('delivery_date')?.value;
    if (!r || !d) return 0;
    const diffTime = Math.abs(d.getTime() - r.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }

  calculateEstimatedTotal(): number {
    const days = this.calculateEstimatedDays();
    const price = parseFloat(this.selectedCar()?.price_per_day as any) || 0;
    return days * price;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.serverError.set(null);
    this.fieldErrors.set({});

    const raw = this.form.getRawValue();
    const payload: any = {
      car_id: raw.car_id,
      payment_type: raw.payment_type,
      order_type: raw.order_type,
      receiving_date: this.datePipe.transform(raw.receiving_date, 'yyyy-MM-dd'),
      delivery_date: this.datePipe.transform(raw.delivery_date, 'yyyy-MM-dd')
    };

    if (raw.order_type === 'installments') {
      payload.down_payment = raw.down_payment;
      payload.number_of_installments = raw.number_of_installments;
    }

    this.customerService.createOrder(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.router.navigate(['/orders', res.id]);
      },
      error: (err) => {
        this.loading.set(false);
        const body = err.error as ApiError;
        if (err.status === 422 && body?.errors) this.fieldErrors.set(body.errors);
        this.serverError.set(body?.message || this.transloco.translate('messages.orderFailed'));
      }
    });
  }
}
