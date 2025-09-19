import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'soloHora',
  standalone: true
})
export class SoloHoraPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    // Si es string y coincide con HH:mm:ss
    if (typeof value === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(value)) {
      const [h, m] = value.split(':');
      return `${h}:${m}`;
    }

    const fecha = new Date(value);
    if (isNaN(fecha.getTime())) return '';

    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }
}
