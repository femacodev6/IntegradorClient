import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Tardanzas } from './tardanzas/tardanzas';
import { HorasExtras } from './horasextras/horasextras';
import { Permisos } from './permisos/permisos';
import { Empty } from './empty/empty';
import { AuthGuard } from './service/auth.guard';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'tardanza', component: Tardanzas, canActivate: [AuthGuard] },
    { path: 'horasextra', component: HorasExtras },
    { path: 'permiso', component: Permisos, canActivate: [AuthGuard] },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
