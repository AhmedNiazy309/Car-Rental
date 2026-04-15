import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Car, Order, PaginatedResponse, CreateCarRequest, UpdateOrderStatusRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  // ─── Users ─────────────────────────────────────────────────
  getUsers(params?: Record<string, string | number>): Observable<PaginatedResponse<User>> {
    return this.http.get<PaginatedResponse<User>>('/admin/users', { params: this.buildParams(params) });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/admin/users/${id}`);
  }

  // ─── Cars ──────────────────────────────────────────────────
  getCars(params?: Record<string, string | number>): Observable<PaginatedResponse<Car>> {
    return this.http.get<PaginatedResponse<Car>>('/admin/cars', { params: this.buildParams(params) });
  }

  getCar(id: number): Observable<Car> {
    return this.http.get<Car>(`/admin/cars/${id}`);
  }

  createCar(data: CreateCarRequest): Observable<Car> {
    return this.http.post<Car>('/admin/cars', data);
  }

  updateCar(id: number, data: Partial<CreateCarRequest>): Observable<Car> {
    return this.http.put<Car>(`/admin/cars/${id}`, data);
  }

  deleteCar(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/admin/cars/${id}`);
  }

  // ─── Orders ────────────────────────────────────────────────
  getOrders(params?: Record<string, string | number>): Observable<PaginatedResponse<Order>> {
    return this.http.get<PaginatedResponse<Order>>('/admin/orders', { params: this.buildParams(params) });
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`/admin/orders/${id}`);
  }

  updateOrderStatus(id: number, data: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.put<Order>(`/admin/orders/${id}`, data);
  }

  // ─── Helpers ───────────────────────────────────────────────
  private buildParams(params?: Record<string, string | number>): HttpParams {
    let hp = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          hp = hp.set(key, String(val));
        }
      });
    }
    return hp;
  }
}
