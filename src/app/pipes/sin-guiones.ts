import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sinGuiones',
  standalone: true
})
export class SinGuionesPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.replaceAll('_', ' ');
  }
}
