import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { AdminService } from '../../../../core/services/admin.service';
import { Order } from '../../../../core/models';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, TranslocoPipe,
    TableModule, ButtonModule, InputTextModule, SelectModule,
    TagModule, SkeletonModule, PaginatorModule, TooltipModule
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class AdminOrderListComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(false);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly perPage = 15;

  readonly searchCtrl = this.fb.control('');
  readonly paymentTypeCtrl = this.fb.control('');
  readonly paymentStatusCtrl = this.fb.control('');
  readonly orderTypeCtrl = this.fb.control('');

  get paymentTypeOptions() {
    return [
      { label: this.transloco.translate('payment.cash'), value: 'cash' },
      { label: this.transloco.translate('payment.visa'), value: 'visa' },
      { label: this.transloco.translate('payment.tamara'), value: 'tamara' }
    ];
  }

  get paymentStatusOptions() {
    return [
      { label: this.transloco.translate('payment.pending'), value: 'pending' },
      { label: this.transloco.translate('payment.success'), value: 'success' },
      { label: this.transloco.translate('payment.failed'), value: 'failed' }
    ];
  }

  get orderTypeOptions() {
    return [
      { label: this.transloco.translate('payment.full'), value: 'full' },
      { label: this.transloco.translate('payment.installments'), value: 'installments' }
    ];
  }

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    const params: Record<string, string | number> = { per_page: this.perPage, page };
    if (this.searchCtrl.value) params['search'] = this.searchCtrl.value;
    if (this.paymentTypeCtrl.value) params['payment_type'] = this.paymentTypeCtrl.value;
    if (this.paymentStatusCtrl.value) params['payment_status'] = this.paymentStatusCtrl.value;
    if (this.orderTypeCtrl.value) params['order_type'] = this.orderTypeCtrl.value;

    this.adminService.getOrders(params).subscribe({
      next: (res) => { this.orders.set(res.data); this.totalRecords.set(res.total); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onPageChange(event: any): void {
    this.loadOrders(Math.floor(event.first / this.perPage) + 1);
  }
}
