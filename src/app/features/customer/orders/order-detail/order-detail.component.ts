import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { CustomerService } from '../../../../core/services/customer.service';
import { Order } from '../../../../core/models';

@Component({
  selector: 'app-customer-order-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, TranslocoPipe,
    ButtonModule, TagModule, CardModule, SkeletonModule, TableModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class CustomerOrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly customerService = inject(CustomerService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.customerService.getOrder(id).subscribe({
      next: (order) => { this.order.set(order); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
