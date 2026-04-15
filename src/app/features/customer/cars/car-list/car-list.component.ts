import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { CustomerService } from '../../../../core/services/customer.service';
import { Car } from '../../../../core/models';

@Component({
  selector: 'app-customer-car-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, TranslocoPipe,
    ButtonModule, InputTextModule, CardModule, SkeletonModule, PaginatorModule
  ],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CustomerCarListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly fb = inject(FormBuilder);

  readonly cars = signal<Car[]>([]);
  readonly loading = signal(false);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly perPage = 12;

  readonly searchCtrl = this.fb.control('');
  readonly brandCtrl = this.fb.control('');
  readonly minPriceCtrl = this.fb.control('');
  readonly maxPriceCtrl = this.fb.control('');

  ngOnInit(): void { this.loadCars(); }

  loadCars(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    const params: Record<string, string | number> = { per_page: this.perPage, page };
    if (this.searchCtrl.value) params['search'] = this.searchCtrl.value;
    if (this.brandCtrl.value) params['brand'] = this.brandCtrl.value;
    if (this.minPriceCtrl.value) params['min_price'] = this.minPriceCtrl.value;
    if (this.maxPriceCtrl.value) params['max_price'] = this.maxPriceCtrl.value;

    this.customerService.getCars(params).subscribe({
      next: (res) => {
        this.cars.set(res.data);
        this.totalRecords.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPageChange(event: any): void {
    this.loadCars(Math.floor(event.first / this.perPage) + 1);
  }
}
