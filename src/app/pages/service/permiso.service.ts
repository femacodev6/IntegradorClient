import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { WritableSignal } from '@angular/core';

export interface PermisosModelos {
  hash: string;
  inicio: string;
  fin: string;
  obs: string;
  allday: boolean;
  identificacion: string;
  code: string;
  idMotivo: string;
  idMotivoBuk: string;
  motivo: string;
  tipoDePermiso: string;
  fullname: string;
  momentoRevision: string;
  paid: string;
  dni: number;
  idBuk?: string;
}

export interface TodosBuk {
  id?: number;
  start_date: string;
  end_date: string;
  days_count: string;
  day_percent: string;
  contribution_days: string;
  workday_stage: string;
  employee_id: string;
  permission_type_id: string;
  paid: string;
  fullname: string;
  justification: string;
  hash: string;
  dni?: number;
  tipo_buk: string; // "permiso", "licencia", "inasistencia"
}

export interface UnionTodosBukInntegra {
  todosBuk?: TodosBuk;       // puede ser null
  permiso?: PermisosModelos; // puede ser null
}

@Injectable()
export class PermisoService {

    getPermisosData(fechaInicio?: string, fechaFin?: string): Promise<UnionTodosBukInntegra[]> {
        const fi = fechaInicio;
        const ff = fechaFin;
        if (!fi || !ff) {
            return Promise.reject('Selecciona fecha inicio y fecha fin');
        }
        const url = `/api/Permisos/ObtenerPermisosProcesados?fechaInicio=${fi}&fechaFin=${ff}`;
        return firstValueFrom(this.http.get<UnionTodosBukInntegra[]>(url));
    }

    // postPermisosData(groupedPermiso: GrupoPermisosBuk, fechaInicio: Date | null): Promise<HorasNoTrabajadasResponse> {
    //     const url = `/api/Permisos/TraspasarAtrazoToBuk`;
    //     const body = {
    //         year: fechaInicio?.getFullYear(),
    //         month: (fechaInicio?.getMonth() ?? 0) + 1,
    //         hours: groupedPermiso.totalAtraso/60,
    //         employee_id: groupedPermiso.idBuk
    //     };
    //     return firstValueFrom(this.http.put<HorasNoTrabajadasResponse>(url, body));
    // }

    constructor(private http: HttpClient) { }

    getPermisos(fechaInicio: string, fechaFin: string): Promise<UnionTodosBukInntegra[]> {
        return this.getPermisosData(fechaInicio, fechaFin);
    }
}
