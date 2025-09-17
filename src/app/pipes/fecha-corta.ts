import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaCorta',
  standalone: true
})
export class FechaCortaPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    // Quitar la T y los segundos
    return value.replace('T', ' ').slice(0, 16);
  }
}
