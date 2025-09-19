import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLarga',
  standalone: true
})
export class FechaLargaPipe implements PipeTransform {
  transform(value: string | Date | null | undefined, locale: string = 'es-ES'): string {
    if (!value) return '';
    const fecha = new Date(value);
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
      .format(fecha)
      .replace('.', ''); // quita el punto en abreviaturas tipo "sept."
  }
}