import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../../../core/services/customer.service';

@Component({
  selector: 'app-installment-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, TranslocoPipe,
    TableModule, ButtonModule, TagModule,
    SkeletonModule, PaginatorModule
  ],
  templateUrl: './installment-list.component.html',
  styleUrls: ['./installment-list.component.css']
})
export class InstallmentListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  readonly installments = signal<any[]>([]);
  readonly loading = signal(true);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly perPage = 15;
  readonly payingId = signal<number | null>(null);

  ngOnInit(): void { this.loadInstallments(); }

  loadInstallments(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    this.customerService.getInstallments({ per_page: this.perPage, page }).subscribe({
      next: (res) => {
        this.installments.set(res.data);
        this.totalRecords.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  payInstallment(id: number): void {
    this.payingId.set(id);
    this.customerService.payInstallment(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('messages.success'), detail: this.transloco.translate('messages.installmentPaid') });
        this.loadInstallments(this.currentPage());
        this.payingId.set(null);
      },
      error: (err) => {
        this.payingId.set(null);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || this.transloco.translate('messages.installmentFailed') });
      }
    });
  }

  onPageChange(event: any): void {
    this.loadInstallments(Math.floor(event.first / this.perPage) + 1);
  }
}
