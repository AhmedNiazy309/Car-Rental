import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { CustomerService } from '../../../../core/services/customer.service';
import { Order } from '../../../../core/models';

@Component({
  selector: 'app-customer-order-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, TranslocoPipe,
    TableModule, ButtonModule, TagModule,
    SkeletonModule, PaginatorModule, TooltipModule
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class CustomerOrderListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);

  readonly orders = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly perPage = 15;

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);
    this.customerService.getOrders({ per_page: this.perPage, page }).subscribe({
      next: (res) => {
        this.orders.set(res.data);
        this.totalRecords.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onPageChange(event: any): void {
    this.loadOrders(Math.floor(event.first / this.perPage) + 1);
  }
}
