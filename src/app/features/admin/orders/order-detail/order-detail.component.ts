import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { AdminService } from '../../../../core/services/admin.service';
import { Order, ApiError } from '../../../../core/models';

@Component({
  selector: 'app-admin-order-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, TranslocoPipe,
    ButtonModule, TagModule, CardModule, SkeletonModule, TableModule, SelectModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class AdminOrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly adminService = inject(AdminService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);
  readonly updating = signal(false);
  readonly statusCtrl = this.fb.control('');

  get statusOptions() {
    return [
      { label: this.transloco.translate('payment.pending'), value: 'pending' },
      { label: this.transloco.translate('payment.success'), value: 'success' },
      { label: this.transloco.translate('payment.failed'), value: 'failed' }
    ];
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.adminService.getOrder(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.statusCtrl.setValue(order.payment_status);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  updateStatus(): void {
    if (!this.statusCtrl.value || !this.order()) return;
    this.updating.set(true);
    this.adminService.updateOrderStatus(this.order()!.id, {
      payment_status: this.statusCtrl.value as any
    }).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.updating.set(false);
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('messages.success'), detail: this.transloco.translate('messages.statusUpdated') });
      },
      error: () => {
        this.updating.set(false);
        this.messageService.add({ severity: 'error', summary: this.transloco.translate('messages.error'), detail: this.transloco.translate('messages.statusUpdateFailed') });
      }
    });
  }
}
