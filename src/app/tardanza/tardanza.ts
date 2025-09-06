import { ChangeDetectionStrategy, ChangeDetectorRef , Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tardanza',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    FormsModule,
    HttpClientModule,
    MatTableModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tardanza.html',
  styleUrls: ['./tardanza.scss']
})
export class Tardanza {
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  dataSource: any[] = [];
  displayedColumns: string[] = ['nombre', 'dia', 'entrada_real', 'atraso'];
   constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  private formatDate(d: Date | null): string {
    if (!d) return '';
    const y = d.getFullYear();
    const m = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${y}-${m}-${day}`;
  }

  viewTardanzas(): void {
    const fi = this.formatDate(this.fechaInicio);
    const ff = this.formatDate(this.fechaFin);
    if (!fi || !ff) {
      alert('Selecciona fecha inicio y fecha fin');
      return;
    }
    const url = `/Tardanzas/ObtenerTardanzas?fechaInicio=${fi}&fechaFin=${ff}`;
    this.http.get<any[]>(url).subscribe({
      next: res => {
        this.dataSource = res;
        this.cd.markForCheck(); 
      },
      error: err => console.error('Error al obtener tardanzas', err)
    });
  }
}
