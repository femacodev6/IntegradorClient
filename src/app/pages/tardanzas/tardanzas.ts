import { Component, OnInit, signal, ViewChild, computed } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Tardanza, GrupoTardanzasBuk, TardanzasBuk, TardanzaService } from '../service/tardanza.service';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MinutesToFriendlyPipe } from '../../pipes/minutes-to-friendly';
import { HoursToFriendlyPipe } from '../../pipes/hours-to-friendly';
import { Chip } from 'primeng/chip';
import { Badge } from 'primeng/badge';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

interface GrupoTardanzas {
    identificacion: string;
    nombre: string | undefined;
    apellidos: string | undefined;
    totalAtraso: number;
    tardanzas: Tardanza[];
}

@Component({
    selector: 'app-tardanza',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        DatePickerModule,
        FloatLabel,
        MinutesToFriendlyPipe,
        HoursToFriendlyPipe,
        Chip,
        Badge
    ],
    templateUrl: './tardanzas.html',
    providers: [TardanzaService, ConfirmationService]
})

export class Tardanzas implements OnInit {

    // fechaInicio: Date | null = null;
    fechaInicio = signal<Date | null>(null);

    fechaFin = signal<Date | null>(null);

    fechaInicioResponse = signal<Date | null>(null);

    fechaFinResponse = signal<Date | null>(null);

    isInicioFinMes = computed<boolean>(() => {
        const inicio = this.fechaInicioResponse();
        const fin = this.fechaFinResponse();

        if (!inicio || !fin) return false;

        const mismoMes =
            inicio.getFullYear() === fin.getFullYear() &&
            inicio.getMonth() === fin.getMonth();

        if (!mismoMes) return false;

        const primerDiaMes = inicio.getDate() === 1;

        const ultimoDiaMes =
            fin.getDate() === new Date(fin.getFullYear(), fin.getMonth() + 1, 0).getDate();

        return primerDiaMes && ultimoDiaMes;
    });

    tardanzaDialog: boolean = false;

    tardanzas = signal<Tardanza[]>([]);

    tardanzasGrupo = signal<GrupoTardanzasBuk[]>([]);

    tardanza!: Tardanza;

    tardanzaGrupo!: GrupoTardanzasBuk;

    selectedTardanzas!: GrupoTardanzasBuk[] | [];
    // selectedTardanzas!: GrupoTardanzasBuk[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    expandedRows = {};

    // turnoSelected: signal();
    turnoSelected = signal<string | null>(null);

    comparacionSelected = signal<number | null>(null);

    constructor
        (
            private tardanzaService: TardanzaService,
            private messageService: MessageService,
            private confirmationService: ConfirmationService
        ) { }

    groupedTardanzas = computed((): GrupoTardanzas[] => {
        const groups = this.tardanzas().reduce<Record<string, GrupoTardanzas>>((acc, t) => {
            const key = String(t.identificacion);
            if (!acc[key]) acc[key] = { identificacion: key, nombre: t.nombre, apellidos: t.apellidos, totalAtraso: 0, tardanzas: [] };
            acc[key].totalAtraso += Number(t.atraso ?? 0);
            acc[key].tardanzas.push(t);
            return acc;
        }, {});

        return Object.values(groups);
    });


    meses: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    mes = computed((): string => {
        const fecha = this.fechaInicioResponse();
        if (fecha == null) return 'Mes';
        return this.meses[fecha.getMonth()];
    });

turnos = computed(() => {
    const map = new Map<string, number>();

    for (const g of this.tardanzasGrupo()) {
        if (!g?.turnos) continue;
        for (const t of g.turnos) {
            if (t != null && t !== '') {
                map.set(t, (map.get(t) ?? 0) + 1);
            }
        }
    }

    return Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([nombre, cantidad]) => ({ nombre, cantidad }));
});

    // turnos = computed(() => {
    //     const s = new Set<string>();
    //     for (const g of this.tardanzasGrupo()) {
    //         if (!g?.turnos) continue;
    //         for (const t of g.turnos) {
    //             if (t != null && t !== '') s.add(t);
    //         }
    //     }
    //     return Array.from(s).sort((a, b) => a.localeCompare(b));
    // });

    setMesActual() {
        const hoy = new Date();
        const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        this.fechaInicio.set(inicio);
        this.fechaFin.set(fin);
    }

    setMesAnterior() {
        const hoy = new Date();
        const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const fin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

        this.fechaInicio.set(inicio);
        this.fechaFin.set(fin);
    }

    comparacions = [
        { id: 1, nombre: "no aplica", severity: "info" },
        { id: 2, nombre: "no hay dato", severity: "warn" },
        { id: 3, nombre: "actualizado", severity: "success" },
        { id: 4, nombre: "discordante", severity: "danger" }
    ]


    comparacionsCantidad = computed(() => {
        const comparacionsNew=this.comparacions.map(c=>{
            return {...c,cantidad:0}
        })
        this.tardanzasGrupoEstado().forEach(tf=>{
            const index = comparacionsNew.findIndex(c=>{
                return c.id==tf.comparacion?.id
            }) 
            comparacionsNew[index].cantidad++
        })
        return comparacionsNew
    })

    tardanzasGrupoEstado = computed(() => {
        return this.tardanzasGrupo().map(tar => {
            if (!this.isInicioFinMes()) {
                return { ...tar, comparacion: this.comparacions.find(c => c.id == 1) }
            }
            else {
                const buk = tar.tardanzasBuk?.()
                if (!buk)
                    return { ...tar, comparacion: this.comparacions.find(c => c.id == 2) }
                else {
                    const bukMinutos = Math.round(buk.hours * 60)
                    if (bukMinutos == tar.totalAtraso)
                        return { ...tar, comparacion: this.comparacions.find(c => c.id == 3) }
                    return { ...tar, comparacion: this.comparacions.find(c => c.id == 4) }
                }
            }
        })
    });
    
    tardanzasGrupoFilter = computed(() => {
        const all = this.tardanzasGrupoEstado();
        const turno = this.turnoSelected();
        const comparacion = this.comparacionSelected();

        return all.filter(tg => {
            if (turno) {
                if (!(tg.turnos?.some(t => t === turno))) return false;
            }
            if (comparacion) {
                if (!(tg.comparacion?.id == comparacion)) return false;
            }
            return true;
        });
    });

    totalColaboradores = computed(() => {
        return this.tardanzasGrupoFilter().length
    })

    ngOnInit() {
    }

    private formatDate(d: Date | null): string {
        if (!d) return '';
        const y = d.getFullYear();
        const m = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${y}-${m}-${day}`;
    }

    atrazoToBuk(index: number, groupedTardanza: GrupoTardanzasBuk) {
        this.tardanzaService.postTardanzasData(groupedTardanza, this.fechaInicio()).then((data) => {
            this.selectedTardanzas = []
            const indexNew = this.tardanzasGrupo().findIndex(tardanza => tardanza.idBuk == data.ausencia?.employeeId)
            const item = this.tardanzasGrupo()[indexNew];
            if (!item) return;
            item?.tardanzasBuk?.set(data.ausencia ?? null);
            this.messageService.add({
                severity: 'success',
                summary: 'Exito',
                detail: 'Total tardanzas traspasadas a Buk',
                life: 3000
            });
        })
            .catch((e) => {
                console.error(e);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo traspasar tardanzas a Buk ' + e.error.error,
                    life: 4000
                });
            });
    }

    atrazoToBukVolcar() {
        this.tardanzaService.postTardanzasBatch(this.selectedTardanzas, this.fechaInicio()).then((data) => {
            this.selectedTardanzas = []
            const exitosos = data.items.filter(req => {
                return req.success == true
            })
            console.log(exitosos);
            exitosos.forEach(exitoso => {
                const index = this.tardanzasGrupo().findIndex(tardanza => {
                    console.log(tardanza.idBuk);
                    return tardanza.idBuk == exitoso.employeeId
                })
                console.log(index);

                const item = this.tardanzasGrupo()[index];
                if (!item) return;
                item?.tardanzasBuk?.set(exitoso?.response?.ausencia ?? null);
            })

            const erroneos = data.total - data.succeeded
            let detalle
            let severidad
            let sumario
            if (data.total == data.succeeded) {
                detalle = data.succeeded + ' tardanzas traspasadas a Buk'
                severidad = 'warn'
                sumario = 'fallo parcial'
            }
            if (erroneos != data.total && data.total > data.succeeded) {
                detalle = data.succeeded + ' tardanzas traspasadas a Buk, ' + erroneos + ' tardanzas fallidas'
                severidad = 'success'
                sumario = 'exito'
            }
            if (erroneos == data.total) {
                detalle = erroneos + ' tardanzas fallidas'
                severidad = 'error'
                sumario = 'fallo'
            }

            this.messageService.add({
                severity: severidad,
                summary: sumario,
                detail: detalle,
                life: 3000
            });
            console.log(data)
        })
            .catch((e) => {
                console.error(e);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo traspasar el volcado tardanzas a Buk ' + e.error.error,
                    life: 4000
                });
            });
    }

    loadDemoData() {
        const fi = this.formatDate(this.fechaInicio());
        const ff = this.formatDate(this.fechaFin());

        this.tardanzaService.getTardanzasGrupo(fi, ff).then((data) => {
            const mapped = (data as any[]).map(g => ({
                ...g,
                // si el backend ya manda un array en g.tardanzasBuk lo usamos, si no, lo inicializamos vacio
                tardanzasBuk: signal<TardanzasBuk | undefined>(g.tardanzasBuk ?? null)
            })) as GrupoTardanzasBuk[];

            this.tardanzasGrupo.set(mapped);

            const start = this.fechaInicio();
            const end = this.fechaFin();

            this.fechaInicioResponse.set(start ? new Date(start.getTime()) : null);
            this.fechaFinResponse.set(end ? new Date(end.getTime()) : null);
        });

        this.cols = [
            { field: 'nombre', header: 'Nombre' },
            { field: 'dia', header: 'Dia' },
            { field: 'entrada_real', header: 'Entrada Real' },
            { field: 'atraso', header: 'Atraso' },
            { field: 'atraso', header: 'Atraso2' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }
}
