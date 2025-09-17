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
import { PermisosModelos, TodosBuk, UnionTodosBukInntegra, PermisoService } from '../service/permiso.service';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MinutesToFriendlyPipe } from '../../pipes/minutes-to-friendly';
import { HoursToFriendlyPipe } from '../../pipes/hours-to-friendly';
import { SinGuionesPipe } from '../../pipes/sin-guiones';
import { FechaCortaPipe } from '../../pipes/fecha-corta';

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
    selector: 'app-permiso',
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
        SinGuionesPipe,
        FechaCortaPipe
    ],
    templateUrl: './permisos.html',
    providers: [MessageService, PermisoService, ConfirmationService]
})


export class Permisos implements OnInit {

    fechaInicio = signal<Date | null>(null);

    fechaFin = signal<Date | null>(null);

    permisoDialog: boolean = false;

    unionTodosBukInntegra = signal<UnionTodosBukInntegra[]>([]);

    // permisosGrupo = signal<GrupoPermisosBuk[]>([]);

    permiso!: UnionTodosBukInntegra;

    selectedPermisos!: UnionTodosBukInntegra[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    expandedRows = {};

    constructor(
        private permisoService: PermisoService,
    ) { }

    ngOnInit() {
    }

   selectedMotivo: number | null = null;

  motivos = signal([
    { label: 'Permiso', items: [{ label: '05 - S.P. PERMISO, LICENCIA SIN GOCE DE HABER', value: 6 }] },
    { label: 'Permiso por hora', items: [{ label: 'HORAS - PERMISO PARTICULAR', value: 13 }] },
    {
      label: 'Permiso por hora con goce',
      items: [
        { label: 'HORAS - TARDANZAS JUSTIFICABLES', value: 8 },
        { label: 'HORAS - ASUNTOS LABORALES', value: 11 },
        { label: 'HORAS - ATENCION MEDICA ESSALUD', value: 16 },
        { label: 'HORAS - PERMISO CON GOCE', value: 22 }
      ]
    },
    { label: 'Compensacion por Dias', items: [{ label: '26 - S.I. PERMISO, LICENCIA CON GOCE DE HABER', value: 21 }] },
    {
      label: 'Compensación por horas Femaco',
      items: [
        { label: '27 - S.I. COMPENSACIÓN POR HORAS SOBRETIEMPO', value: 9 },
        { label: 'HORAS - COMPENSACIÓN DE HORA DE ALMUERZO', value: 19 }
      ]
    },
    {
      label: 'Licencia',
      items: [
        { label: '20 - S.I. ENFERM/ACCIDENTE (20 PRIMEROS DÍAS)', value: 1 },
        { label: '20 - S.I. COVID-19 ENFERMEDAD COMÚN (20 PRIMEROS DÍAS)', value: 12 },
        { label: '28 - S.I. DÍAS LICENCIA POR PATERNIDAD', value: 4 },
        { label: '22 - S.I. MATERNIDAD - PRE Y POST NATAL', value: 14 },
        { label: '21 - S.I. INCAP TEMPORAL (SUBSIDIADO)', value: 15 },
        { label: '32 - S.I. FALLECIMIENTO PADRES, CÓNYUGE O HIJOS', value: 20 },
        { label: '20 - S.I. SCTR ENFERMEDAD COMÚN (20 PRIMEROS DÍAS)', value: 25 }
      ]
    },
    {
      label: 'Inasistencia',
      items: [
        { label: '01 - S.P. SANCIÓN DISCIPLINARIA', value: 7 },
        { label: 'FALTA INJUSTIFICADA', value: 27 }
      ]
    },
    {
      label: 'Otros',
      items: [
        { label: '24 - S.I. LIC DESEMP CARGO CÍVICO', value: 2 },
        { label: '23 - S.I. DESCANSO VACACIONAL', value: 3 },
        { label: 'OTROS', value: 5 },
        { label: 'PERSONAL DE CONFIANZA', value: 10 },
        { label: 'HORAS - CIERRE DE COMPENSACIÓN', value: 17 },
        { label: 'HORAS - VACUNA CONTRA COVID-19', value: 18 },
        { label: 'HORAS - SANCIÓN DISCIPLINARIA', value: 23 },
        { label: 'MEMORANDUMS', value: 24 },
        { label: 'ESPECIE VALORADA PENDIENTE DE CANJE CITT', value: 26 }
      ]
    }
  ]);

    private formatDate(d: Date | null): string {
        if (!d) return '';
        const y = d.getFullYear();
        const m = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${y}-${m}-${day}`;
    }

        bukTipoPermiso(todosBuk:any) {
            const permiso = todosBuk?.permiso
            const licencia = todosBuk?.licencia
            const inasistencia = todosBuk?.inasistencia
            if(permiso) return permiso.permissionTypeCode
            if(licencia) return licencia.licenceTypeCode
            if(inasistencia) return inasistencia.absenceTypeCode
            return ''
    }
        bukPagado(todosBuk:any) {
            const permiso = todosBuk?.permiso
            const licencia = todosBuk?.licencia
            const inasistencia = todosBuk?.inasistencia
            if(permiso) return permiso.paid
            if(licencia) return true
            if(inasistencia) return false
            return null
    }

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

    // atrazoToBuk(index: number, groupedPermiso: GrupoPermisosBuk) {
    //     this.permisoService.postPermisosData(groupedPermiso, this.fechaInicio).then((data) => {
    //         const item = this.permisosGrupo()[index];
    //         if (!item) return;
    //         item?.permisosBuk?.set(data.ausencia);
    //     });
    // }

    loadDemoData() {
        const fi = this.formatDate(this.fechaInicio());
        const ff = this.formatDate(this.fechaFin());

        this.permisoService.getPermisos(fi, ff).then((data) => {
            this.unionTodosBukInntegra.set(data);
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
