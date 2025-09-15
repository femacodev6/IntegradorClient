import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { WritableSignal } from '@angular/core';

export interface HorasExtrasInngresa {
  identificacion: string;
  horasExtras: HoraExtras[];
  totales: Totales;
}

export interface HoraExtras {
  dia: string;              // "2025-09-15"
  horas_extra: string;      // "01:30"
  editable: boolean;
  gestionado: boolean;
  revision: Revision;
}

export interface Revision {
  aprobadas: string;
  paraCompensar: string;
  pagadas: string;
  descartadas: string;
  observaciones: string;
  administrador: string;
}

export interface Totales {
  aprobadas: string;
  paraCompensar: string;
  pagadas: string;
  descartadas: string;
}

export interface HorasExtrasBuk {
  day?: number;
  month?: number;
  year?: number;
  hours?: number;
  id?: number;
  employee_id?: number;
  type_id?: number;
  centro_costo?: string;
  centro_costo_code?: string;
}

export interface HorasExtrasInngresaBuk extends HorasExtrasInngresa {
  horasExtrasBuk: HorasExtrasBuk[];
}

export interface Atrazo {
    day?: number;
    month?: number;
    year?: number;
    hours?: number;
    id?: number;
    employee_id?: number;
    type_id?: number;
}

export interface HorasNoTrabajadasRequest {
    employee_id: number;
    hours: number;
    year?: number;
    month?: number;
    // type_id se pone en el backend (si lo necesitas en front, agréguelo)
}

export interface HorasNoTrabajadasResponse {
    message?: string;
    ausencia?: HorasExtrasBuk;
}


export interface BatchItemResponse {
    employeeId: number;
    success: boolean;
    errorMessage?: string | null;
    response?: HorasNoTrabajadasResponse | null;
}

export interface BatchSummary {
    total: number;
    succeeded: number;
    failed: number;
    items: BatchItemResponse[];
}

@Injectable()
export class HorasExtraService {

 
    getHorasExtrasGrupoData(fechaInicio?: string, fechaFin?: string): Promise<HorasExtrasInngresaBuk[]> {
        const fi = fechaInicio;
        const ff = fechaFin;
        if (!fi || !ff) {
            return Promise.reject('Selecciona fecha inicio y fecha fin');
        }
        const url = `/api/HorasExtras/ObtenerHorasExtrasCombinadas?fechaInicio=${fi}&fechaFin=${ff}`;
        return firstValueFrom(this.http.get<HorasExtrasInngresaBuk[]>(url));
    }

    constructor(private http: HttpClient) { }


    getHorasExtrasGrupo(fechaInicio: string, fechaFin: string): Promise<HorasExtrasInngresaBuk[]> {
        return this.getHorasExtrasGrupoData(fechaInicio, fechaFin);
    }
}
