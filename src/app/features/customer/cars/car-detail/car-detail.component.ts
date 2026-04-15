import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CustomerService } from '../../../../core/services/customer.service';
import { Car } from '../../../../core/models';

@Component({
  selector: 'app-customer-car-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslocoPipe, ButtonModule, SkeletonModule],
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CustomerCarDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly customerService = inject(CustomerService);

  readonly car = signal<Car | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.customerService.getCar(id).subscribe({
      next: (car) => { this.car.set(car); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
