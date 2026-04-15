export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  wallet: string | null;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
  orders?: Order[];
}

export interface Car {
  id: number;
  name: string;
  brand: string;
  model: string;
  kilometers: number;
  price_per_day: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  car_id: number;
  delivery_date: string;
  receiving_date: string;
  days: number;
  total_price: string;
  points: number;
  payment_type: 'cash' | 'visa' | 'tamara';
  payment_status: 'pending' | 'success' | 'failed';
  order_type: 'full' | 'installments';
  created_at: string;
  updated_at: string;
  user?: User;
  car?: Car;
  installments?: Installment[];
}

export interface Installment {
  id: number;
  order_id: number;
  amount: string;
  due_date: string;
  status: 'paid' | 'pending';
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  country: string;
}

export interface CreateCarRequest {
  name: string;
  brand: string;
  model: string;
  kilometers: number;
  price_per_day: number;
}

export interface CreateOrderRequest {
  car_id: number;
  delivery_date: string;
  receiving_date: string;
  payment_type: 'cash' | 'visa' | 'tamara';
  order_type: 'full' | 'installments';
  down_payment?: number;
  number_of_installments?: number;
}

export interface UpdateOrderStatusRequest {
  payment_status: 'pending' | 'success' | 'failed';
}
