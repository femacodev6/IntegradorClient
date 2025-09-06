import { Routes } from '@angular/router';
import { About } from './about/about';
import { Licencia } from './licencia/licencia';
import { Tardanza } from './tardanza/tardanza';

export const routes: Routes = [
  { path: 'about', component: About },
  { path: 'licencia', component: Licencia },
  { path: 'tardanza', component: Tardanza },
];