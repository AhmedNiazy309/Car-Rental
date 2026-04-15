import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layout/auth-layout.component';
import { AdminLayoutComponent } from './core/layout/admin-layout.component';
import { CustomerLayoutComponent } from './core/layout/customer-layout.component';
import { guestGuard, adminGuard, customerGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  // Public auth routes
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    ]
  },

  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'cars', pathMatch: 'full' },
      { path: 'users', loadComponent: () => import('./features/admin/users/user-list/user-list.component').then(m => m.UserListComponent) },
      { path: 'users/:id', loadComponent: () => import('./features/admin/users/user-detail/user-detail.component').then(m => m.UserDetailComponent) },
      { path: 'cars', loadComponent: () => import('./features/admin/cars/car-list/car-list.component').then(m => m.AdminCarListComponent) },
      { path: 'cars/new', loadComponent: () => import('./features/admin/cars/car-form/car-form.component').then(m => m.CarFormComponent) },
      { path: 'cars/:id/edit', loadComponent: () => import('./features/admin/cars/car-form/car-form.component').then(m => m.CarFormComponent) },
      { path: 'orders', loadComponent: () => import('./features/admin/orders/order-list/order-list.component').then(m => m.AdminOrderListComponent) },
      { path: 'orders/:id', loadComponent: () => import('./features/admin/orders/order-detail/order-detail.component').then(m => m.AdminOrderDetailComponent) },
    ]
  },

  // Customer routes
  {
    path: '',
    component: CustomerLayoutComponent,
    canActivate: [customerGuard],
    children: [
      { path: 'cars', loadComponent: () => import('./features/customer/cars/car-list/car-list.component').then(m => m.CustomerCarListComponent) },
      { path: 'cars/:id', loadComponent: () => import('./features/customer/cars/car-detail/car-detail.component').then(m => m.CustomerCarDetailComponent) },
      { path: 'orders', loadComponent: () => import('./features/customer/orders/order-list/order-list.component').then(m => m.CustomerOrderListComponent) },
      { path: 'orders/new', loadComponent: () => import('./features/customer/orders/order-create/order-create.component').then(m => m.OrderCreateComponent) },
      { path: 'orders/:id', loadComponent: () => import('./features/customer/orders/order-detail/order-detail.component').then(m => m.CustomerOrderDetailComponent) },
      { path: 'installments', loadComponent: () => import('./features/customer/installments/installment-list/installment-list.component').then(m => m.InstallmentListComponent) },
    ]
  },

  // Fallback
  { path: '**', redirectTo: '/login' }
];
