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
import { AdminService } from '../../../../core/services/admin.service';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule, TranslocoPipe,
    TableModule, ButtonModule, InputTextModule, SelectModule,
    TagModule, SkeletonModule, PaginatorModule
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly totalRecords = signal(0);
  readonly currentPage = signal(1);
  readonly perPage = 15;

  readonly searchCtrl = this.fb.control('');
  readonly roleCtrl = this.fb.control('');
  readonly countryCtrl = this.fb.control('');

  get roleOptions() {
    return [
      { label: this.transloco.translate('roles.admin'), value: 'admin' },
      { label: this.transloco.translate('roles.customer'), value: 'customer' }
    ];
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    const params: Record<string, string | number> = {
      per_page: this.perPage,
      page
    };
    if (this.searchCtrl.value) params['search'] = this.searchCtrl.value;
    if (this.roleCtrl.value) params['role'] = this.roleCtrl.value;
    if (this.countryCtrl.value) params['country'] = this.countryCtrl.value;

    this.adminService.getUsers(params).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.totalRecords.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onPageChange(event: any): void {
    this.loadUsers(Math.floor(event.first / this.perPage) + 1);
  }
}
