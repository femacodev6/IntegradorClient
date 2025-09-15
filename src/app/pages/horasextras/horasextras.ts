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
import { HorasExtrasInngresaBuk, HorasExtrasBuk, HorasExtraService } from '../service/horasExtra.service';
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


@Component({
    selector: 'app-horasExtra',
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
    templateUrl: './horasExtras.html',
    providers: [HorasExtraService, ConfirmationService]
})

export class HorasExtras implements OnInit {

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

    horasExtraDialog: boolean = false;

    // horasExtras = signal<HorasExtra[]>([]);

    horasExtrasGrupo = signal<HorasExtrasInngresaBuk[]>([]);

    // horasExtra!: HorasExtra;

    horasExtraGrupo!: HorasExtrasInngresaBuk;

    selectedHorasExtras!: HorasExtrasInngresaBuk[] | [];
    // selectedHorasExtras!: GrupoHorasExtrasBuk[] | null;

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
            private horasExtraService: HorasExtraService,
            private messageService: MessageService,
            private confirmationService: ConfirmationService
        ) { }

    // groupedHorasExtras = computed((): GrupoHorasExtras[] => {
    //     const groups = this.horasExtras().reduce<Record<string, GrupoHorasExtras>>((acc, t) => {
    //         const key = String(t.identificacion);
    //         if (!acc[key]) acc[key] = { identificacion: key, nombre: t.nombre, apellidos: t.apellidos, totalAtraso: 0, horasExtras: [] };
    //         acc[key].totalAtraso += Number(t.atraso ?? 0);
    //         acc[key].horasExtras.push(t);
    //         return acc;
    //     }, {});

    //     return Object.values(groups);
    // });


    meses: string[] = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    mes = computed((): string => {
        const fecha = this.fechaInicioResponse();
        if (fecha == null) return 'Mes';
        return this.meses[fecha.getMonth()];
    });



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

    // // 1) Un único computed que devuelve las tres vistas
    // horasExtrasGrupoFilters = computed(() => {
    //     const all = this.horasExtrasGrupoEstado();
    //     const turno = this.turnoSelected();
    //     const comparacion = this.comparacionSelected();

    //     const byTurno: typeof all = [];
    //     const byComparacion: typeof all = [];
    //     const both: typeof all = [];

    //     for (const tg of all) {
    //         const hasTurno = !turno || tg.turnos?.some(t => t === turno);
    //         const hasComparacion = !comparacion || tg.comparacion?.id == comparacion;

    //         if (hasTurno) byTurno.push(tg);
    //         if (hasComparacion) byComparacion.push(tg);
    //         if (hasTurno && hasComparacion) both.push(tg);
    //     }

    //     return { all, byTurno, byComparacion, both };
    // });

    // // 2) Reutilizar el resultado para exponer los filtros individuales (muy baratos)
    // horasExtrasGrupoFilter = computed(() => this.horasExtrasGrupoFilters().both);
    // horasExtrasGrupoFilterTurno = computed(() => this.horasExtrasGrupoFilters().byTurno);
    // horasExtrasGrupoFilterComparacion = computed(() => this.horasExtrasGrupoFilters().byComparacion);

    // // 3) turnos — contar usando Map, recorrido único sobre los turnos relevantes
    // turnos = computed(() => {
    //     const map = new Map<string, number>();
    //     for (const g of this.horasExtrasGrupoFilterComparacion()) {
    //         if (!g?.turnos) continue;
    //         for (const t of g.turnos) {
    //             if (t != null && t !== '') {
    //                 map.set(t, (map.get(t) ?? 0) + 1);
    //             }
    //         }
    //     }

    //     return Array.from(map.entries())
    //         .sort((a, b) => a[0].localeCompare(b[0]))
    //         .map(([nombre, cantidad]) => ({ nombre, cantidad }));
    // });

    // // 4) comparacionsCantidad — construir un mapa de conteos y mapear comparacions (O(n + m))
    // comparacionsCantidad = computed(() => {
    //     const counts = new Map<any, number>();
    //     for (const tf of this.horasExtrasGrupoFilterTurno()) {
    //         const id = tf.comparacion?.id;
    //         if (id != null) counts.set(id, (counts.get(id) ?? 0) + 1);
    //     }
    //     return this.comparacions.map(c => ({ ...c, cantidad: counts.get(c.id) ?? 0 }));
    // });

    // horasExtrasGrupoEstado = computed(() => {
    //     return this.horasExtrasGrupo().map(tar => {
    //         if (!this.isInicioFinMes()) {
    //             return { ...tar, comparacion: this.comparacions.find(c => c.id == 1) }
    //         }
    //         else {
    //             const buk = tar.horasExtrasBuk?.()
    //             if (!buk)
    //                 return { ...tar, comparacion: this.comparacions.find(c => c.id == 2) }
    //             else {
    //                 const bukMinutos = Math.round(buk.hours * 60)
    //                 if (bukMinutos == tar.totalAtraso)
    //                     return { ...tar, comparacion: this.comparacions.find(c => c.id == 3) }
    //                 return { ...tar, comparacion: this.comparacions.find(c => c.id == 4) }
    //             }
    //         }
    //     })
    // });


    // totalColaboradores = computed(() => {
    //     return this.horasExtrasGrupoFilter().length
    // })

    ngOnInit() {
    }

    private formatDate(d: Date | null): string {
        if (!d) return '';
        const y = d.getFullYear();
        const m = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${y}-${m}-${day}`;
    }

    // atrazoToBuk(index: number, groupedHorasExtra: GrupoHorasExtrasBuk) {
    //     this.horasExtraService.postHorasExtrasData(groupedHorasExtra, this.fechaInicio()).then((data) => {
    //         this.selectedHorasExtras = []
    //         const indexNew = this.horasExtrasGrupo().findIndex(horasExtra => horasExtra.idBuk == data.ausencia?.employeeId)
    //         const item = this.horasExtrasGrupo()[indexNew];
    //         if (!item) return;
    //         item?.horasExtrasBuk?.set(data.ausencia ?? null);
    //         this.messageService.add({
    //             severity: 'success',
    //             summary: 'Éxito',
    //             detail: '1 horasExtra traspasadas a Buk',
    //             life: 3000
    //         });
    //     })
    //         .catch((e) => {
    //             console.error(e);
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: 'No se pudo traspasar horasExtra a Buk ' + e.error.error,
    //                 life: 4000
    //             });
    //         });
    // }

    // atrazoToBukVolcar() {
    //     this.horasExtraService.postHorasExtrasBatch(this.selectedHorasExtras, this.fechaInicio()).then((data) => {
    //         this.selectedHorasExtras = []
    //         const exitosos = data.items.filter(req => {
    //             return req.success == true
    //         })
    //         console.log(exitosos);
    //         exitosos.forEach(exitoso => {
    //             const index = this.horasExtrasGrupo().findIndex(horasExtra => {
    //                 console.log(horasExtra.idBuk);
    //                 return horasExtra.idBuk == exitoso.employeeId
    //             })
    //             console.log(index);

    //             const item = this.horasExtrasGrupo()[index];
    //             if (!item) return;
    //             item?.horasExtrasBuk?.set(exitoso?.response?.ausencia ?? null);
    //         })

    //         const erroneos = data.total - data.succeeded
    //         let detalle
    //         let severidad
    //         let sumario
    //         if (data.total == data.succeeded) {
    //             detalle = data.succeeded + ' horasExtras traspasadas a Buk'
    //             severidad = 'success'
    //             sumario = 'Éxito total'
    //         }
    //         if (erroneos != data.total && data.total > data.succeeded) {
    //             detalle = data.succeeded + ' horasExtras traspasadas a Buk, ' + erroneos + ' horasExtras fallidas'
    //             severidad = 'warn'
    //             sumario = 'Éxito parcial'
    //         }
    //         if (erroneos == data.total) {
    //             detalle = erroneos + ' horasExtras fallidas'
    //             severidad = 'error'
    //             sumario = 'Fallo total'
    //         }

    //         this.messageService.add({
    //             severity: severidad,
    //             summary: sumario,
    //             detail: detalle,
    //             life: 3000
    //         });
    //         console.log(data)
    //     })
    //         .catch((e) => {
    //             console.error(e);
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: 'No se pudo traspasar el volcado horasExtras a Buk ' + e.error.error,
    //                 life: 4000
    //             });
    //         });
    // }

    loadDemoData() {
        const fi = this.formatDate(this.fechaInicio());
        const ff = this.formatDate(this.fechaFin());

        this.horasExtraService.getHorasExtrasGrupo(fi, ff).then((data) => {
            const mapped = (data as any[]).map(g => ({
                ...g,
                // si el backend ya manda un array en g.horasExtrasBuk lo usamos, si no, lo inicializamos vacio
                horasExtrasBuk: signal<HorasExtrasBuk | undefined>(g.horasExtrasBuk ?? [])
            })) as HorasExtrasInngresaBuk[];

            this.horasExtrasGrupo.set(mapped);

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
