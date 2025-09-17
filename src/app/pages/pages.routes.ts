import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Tardanzas } from './tardanzas/tardanzas';
// import { HorasExtras } from './horasextras/horasextras';
import { Permisos } from './permisos/permisos';
import { Empty } from './empty/empty';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'tardanza', component: Tardanzas },
    // { path: 'horasextra', component: HorasExtras },
    { path: 'permiso', component: Permisos },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
