import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car, Order, Installment, PaginatedResponse, CreateOrderRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private http: HttpClient) {}

  // ─── Cars ──────────────────────────────────────────────────
  getCars(params?: Record<string, string | number>): Observable<PaginatedResponse<Car>> {
    return this.http.get<PaginatedResponse<Car>>('/customer/cars', { params: this.buildParams(params) });
  }

  getCar(id: number): Observable<Car> {
    return this.http.get<Car>(`/customer/cars/${id}`);
  }

  // ─── Orders ────────────────────────────────────────────────
  getOrders(params?: Record<string, string | number>): Observable<PaginatedResponse<Order>> {
    return this.http.get<PaginatedResponse<Order>>('/customer/orders', { params: this.buildParams(params) });
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`/customer/orders/${id}`);
  }

  createOrder(data: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>('/customer/orders', data);
  }

  // ─── Installments ─────────────────────────────────────────
  getInstallments(params?: Record<string, string | number>): Observable<PaginatedResponse<Installment>> {
    return this.http.get<PaginatedResponse<Installment>>('/customer/installments', { params: this.buildParams(params) });
  }

  payInstallment(id: number): Observable<{ message: string; installment: Installment; order: Order }> {
    return this.http.post<{ message: string; installment: Installment; order: Order }>(
      `/customer/installments/${id}/pay`, {}
    );
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
