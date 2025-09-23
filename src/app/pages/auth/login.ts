import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, HttpClientModule, ButtonModule, InputTextModule, PasswordModule, RippleModule],
    template: `


<div style="background: #8fc74a" class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
     <div class="flex flex-col items-center justify-center"> 
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-18 px-12 sm:px-10" style="border-radius: 24px"> 
            <div class="text-center mb-8"> <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Iniciar Sesión</div>
         </div>
          <div> 
            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Usuario</label> 
            <input pInputText id="email1" type="text" class="w-full md:w-60 mb-8" [(ngModel)]="email" />
             <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label> 
             <p-password id="password1" class="mb-14" [(ngModel)]="password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
             <div *ngIf="error" class="text-red-600 mb-3">{{ error }}</div>
             <div *ngIf="dbMessage" class="text-sm text-gray-700 mb-3">{{ dbMessage }}</div>
             <p-button [label]="loading ? 'Ingresando...' : 'Iniciar Sesión'" styleClass="w-full" (click)="login()"></p-button>
            </div>
        </div>
    </div>
</div>
  `
})
export class Login {
    email = '';
    password = '';
    error: string | null = null;
    dbMessage: string | null = null;
    loading = false;

    constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

    login() {
        this.error = null;
        this.dbMessage = null;
        if (!this.email || !this.password) { this.error = 'Ingrese usuario y contraseña.'; return; }

        this.loading = true;
        const body = { usuario: this.email, contrasena: this.password };

        this.http.post<{ success: boolean; conexion: boolean; message?: string }>('/api/auth/login', body)
            .subscribe({
                next: res => {
                    this.loading = false;
                    if (res.success && res.conexion) {
                        this.auth.setConnection(true);                 // guarda conexion:true
                        this.router.navigate(['/']);          // ruta protegida
                    } else {
                        this.auth.setConnection(false);
                        this.error = res.message ?? 'Usuario o contraseña incorrectos.';
                        if (res.success && !res.conexion) this.dbMessage = 'No se pudo conectar a la base de datos.';
                    }
                },
                error: () => {
                    this.loading = false;
                    this.auth.setConnection(false);
                    this.error = 'Error en el servidor. Reintente más tarde.';
                }
            });
    }
}
