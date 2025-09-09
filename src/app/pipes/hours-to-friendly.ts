// src/app/pipes/hours-to-friendly.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursToFriendly',
  standalone: true
})
export class HoursToFriendlyPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || isNaN(Number(value))) return '';

    const sign = value < 0 ? '-' : '';
    const total = Math.abs(value);

    const hours = Math.floor(total);
    const mins = Math.round((total - hours) * 60);

    const hoursPart = hours ? `${hours} ${hours === 1 ? 'hora' : 'horas'}` : '';
    const minsPart = mins ? `${mins} min` : '';

    if (hours && mins) return `${sign}${hoursPart} y ${minsPart}`;
    if (hours) return `${sign}${hoursPart}`;
    if (mins) return `${sign}${minsPart}`;
    return '0 min';
  }
}
