// src/app/pipes/minutes-to-friendly.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToFriendly',
  standalone: true
})
export class MinutesToFriendlyPipe implements PipeTransform {
  transform(value: number | null | undefined, longForm = false): string {
    if (value == null || isNaN(Number(value))) return '';

    const sign = value < 0 ? '-' : '';
    const total = Math.abs(Math.round(Number(value)));
    const hours = Math.floor(total / 60);
    const mins = total % 60;

    const hourLabel = longForm ? (hours === 1 ? 'hora' : 'horas') : (hours === 1 ? 'h' : 'h');
    const minLabel  = longForm ? (mins === 1 ? 'minuto' : 'minutos') : 'min';

    const hoursPart = hours ? `${hours} ${hourLabel}` : '';
    const minsPart  = mins  ? `${mins} ${minLabel}`  : '';

    if (hours && mins) return `${sign}${hoursPart} y ${minsPart}`;
    if (hours) return `${sign}${hoursPart}`;
    if (mins)  return `${sign}${minsPart}`;
    return '0 min';
  }
}
