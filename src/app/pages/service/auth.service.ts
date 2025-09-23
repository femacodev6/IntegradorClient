// auth.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = signal<boolean>(localStorage.getItem('conexion') === 'true');
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  setConnection(value: boolean) {
    localStorage.setItem('conexion', value ? 'true' : 'false');
    this._isAuthenticated.set(value);
  }

  clear() {
    localStorage.removeItem('conexion');
    this._isAuthenticated.set(false);
  }
}
