import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { WritableSignal } from '@angular/core';

export interface Tardanza {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;

    identificacion?: string,
    nombre?: string,
    apellidos?: string,
    dia?: string,
    turno?: string,
    atraso?: number,
    entrada_real?: string,
    entrada?: string,
    momento_revision?: boolean | null,
    aprobador?: string | null,
    observaciones?: string | null,
    tolerancia?: number
}

export interface TardanzasBuk {
    id: number;
    day: number;
    month: number;
    year: number;
    hours: number;
    employeeId: number;
    typeId: number;
}

export interface TardanzasInngresa {
    identificacion: string;
    nombre: string;
    apellidos: string;
    dia: string;
    turno: string;
    atraso: number;
    entradaReal: string;
    entrada: string;
    momentoRevision?: boolean | null;
    aprobador?: string | null;
    observaciones?: string | null;
    tolerancia: number;
}

export interface GrupoTardanzas {
    identificacion: string;
    nombre: string;
    apellidos: string;
    turnos: string[];
    totalAtraso: number;
    tardanzas: TardanzasInngresa[];
    IdBuk: number;
    TardanzasBuk: TardanzasBuk;
}

export interface GrupoTardanzasBuk {
    identificacion: string;
    nombre: string;
    apellidos: string;
    turnos: string[];
    totalAtraso: number;
    tardanzas: TardanzasInngresa[];
    idBuk: number;
    tardanzasBuk?: WritableSignal<TardanzasBuk | undefined>;
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

export interface HorasNoTrabajadasResponse {
    message?: string;
    ausencia?: TardanzasBuk;
}

@Injectable()
export class TardanzaService {

    // getTardanzasData(fechaInicio?: string, fechaFin?: string): Promise<Tardanza[]> {
    //     const fi = fechaInicio;
    //     const ff = fechaFin;
    //     if (!fi || !ff) {
    //         return Promise.reject('Selecciona fecha inicio y fecha fin');
    //     }
    //     const url = `/api/Tardanzas/ObtenerTardanzas?fechaInicio=${fi}&fechaFin=${ff}`;
    //     return firstValueFrom(this.http.get<Tardanza[]>(url));
    // }

    postTardanzasData(groupedTardanza: GrupoTardanzasBuk, fechaInicio: Date | null): Promise<HorasNoTrabajadasResponse> {
        const url = `/api/Tardanzas/TraspasarAtrazoToBuk`;
        const body = {
            year: fechaInicio?.getFullYear(),
            month: (fechaInicio?.getMonth() ?? 0) + 1,
            hours: groupedTardanza.totalAtraso/60,
            employee_id: groupedTardanza.idBuk
        };
        return firstValueFrom(this.http.put<HorasNoTrabajadasResponse>(url, body));
    }

    getTardanzasGrupoData(fechaInicio?: string, fechaFin?: string): Promise<GrupoTardanzasBuk[]> {
        const fi = fechaInicio;
        const ff = fechaFin;
        if (!fi || !ff) {
            return Promise.reject('Selecciona fecha inicio y fecha fin');
        }
        const url = `/api/Tardanzas/ObtenerTardanzasConBuk?fechaInicio=${fi}&fechaFin=${ff}`;
        return firstValueFrom(this.http.get<GrupoTardanzasBuk[]>(url));
    }

    constructor(private http: HttpClient) { }

    // getTardanzas(fechaInicio: string, fechaFin: string): Promise<Tardanza[]> {
    //     return this.getTardanzasData(fechaInicio, fechaFin);
    // }

    getTardanzasGrupo(fechaInicio: string, fechaFin: string): Promise<GrupoTardanzasBuk[]> {
        return this.getTardanzasGrupoData(fechaInicio, fechaFin);
    }
}
