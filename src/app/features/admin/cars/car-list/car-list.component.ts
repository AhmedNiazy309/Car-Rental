import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { AdminService } from '../../../../core/services/admin.service';
import { Car } from '../../../../core/models';

@Component({
  selector: 'app-admin-car-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, TranslocoPipe,
    TableModule, ButtonModule, InputTextModule,
    SkeletonModule, PaginatorModule, TooltipModule
  ],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class AdminCarListComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);
  private readonly confirmService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  readonly cars = signal<Car[]>([]);
  readonly loading = signal(false);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly perPage = 15;

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

    this.adminService.getCars(params).subscribe({
      next: (res) => { this.cars.set(res.data); this.totalRecords.set(res.total); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  confirmDelete(car: Car): void {
    this.confirmService.confirm({
      message: `${this.transloco.translate('order.confirmDelete')} "${car.name}"?`,
      header: this.transloco.translate('order.confirmDeleteHeader'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adminService.deleteCar(car.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: this.transloco.translate('messages.deleted'), detail: this.transloco.translate('messages.carDeleted') });
            this.loadCars(this.currentPage());
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: this.transloco.translate('messages.error'), detail: this.transloco.translate('messages.carDeleteFailed') });
          }
        });
      }
    });
  }

  onPageChange(event: any): void {
    this.loadCars(Math.floor(event.first / this.perPage) + 1);
  }
}
