// src/app/pipes/time-to-friendly.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeToFriendly',
  standalone: true
})
export class TimeToFriendlyPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const [hh, mm] = value.split(':').map(v => parseInt(v, 10));
    if (isNaN(hh) || isNaN(mm)) return '';

    const hoursPart = hh ? `${hh} ${hh === 1 ? 'hora' : 'horas'}` : '';
    const minsPart = mm ? `${mm} min` : '';

    if (hh && mm) return `${hoursPart} y ${minsPart}`;
    if (hh) return hoursPart;
    if (mm) return minsPart;
    return '';
  }
}
