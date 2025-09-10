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
import { Tardanza, GrupoTardanzasBuk,TardanzasBuk, TardanzaService } from '../service/tardanza.service';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MinutesToFriendlyPipe } from '../../pipes/minutes-to-friendly';
import { HoursToFriendlyPipe } from '../../pipes/hours-to-friendly';

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
        HoursToFriendlyPipe
    ],
    templateUrl: './tardanzas.html',
    providers: [MessageService, TardanzaService, ConfirmationService]
})


export class Tardanzas implements OnInit {

    fechaInicio: Date | null = null;
    fechaFin: Date | null = null;

    tardanzaDialog: boolean = false;

    tardanzas = signal<Tardanza[]>([]);

    tardanzasGrupo = signal<GrupoTardanzasBuk[]>([]);

    tardanza!: Tardanza;

    selectedTardanzas!: Tardanza[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];
    expandedRows = {};

    constructor(
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
    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        // this.loadDemoData();
    }
    private formatDate(d: Date | null): string {
        if (!d) return '';
        const y = d.getFullYear();
        const m = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${y}-${m}-${day}`;
    }
    atrazoToBuk(index: number, groupedTardanza: GrupoTardanzasBuk) {
        this.tardanzaService.postTardanzasData(groupedTardanza, this.fechaInicio).then((data) => {
            const item = this.tardanzasGrupo()[index];
            if (!item) return;
            item?.tardanzasBuk?.set(data.ausencia);
        });
    }

    loadDemoData() {
        const fi = this.formatDate(this.fechaInicio);
        const ff = this.formatDate(this.fechaFin);
        const data = [
            {
                "identificacion": "70422992",
                "nombre": "JOSE MANUEL",
                "apellidos": "PONCE APAZA",
                "dia": "2025-09-01",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 1,
                "entrada_real": "07:01",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70422992",
                "nombre": "JOSE MANUEL",
                "apellidos": "PONCE APAZA",
                "dia": "2025-09-02",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 8,
                "entrada_real": "07:08",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70422992",
                "nombre": "JOSE MANUEL",
                "apellidos": "PONCE APAZA",
                "dia": "2025-09-03",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 6,
                "entrada_real": "07:06",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71328328",
                "nombre": "CARLOS ALBERTO",
                "apellidos": "CABANA MAMANI",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 1,
                "entrada_real": "07:31",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "44314287",
                "nombre": "MARYLIZ VERONICA",
                "apellidos": "CUEVA VELARDE",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 5,
                "entrada_real": "07:35",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "44314287",
                "nombre": "MARYLIZ VERONICA",
                "apellidos": "CUEVA VELARDE",
                "dia": "2025-09-02",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 8,
                "entrada_real": "07:38",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "44314287",
                "nombre": "MARYLIZ VERONICA",
                "apellidos": "CUEVA VELARDE",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 9,
                "entrada_real": "07:39",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71653128",
                "nombre": "MAGALY KAROL",
                "apellidos": "CAYLLAHUA JIMENEZ",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 7,
                "entrada_real": "07:37",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "47644021",
                "nombre": "LILEY DANITZA",
                "apellidos": "CONDORI CHAHUAYHUA",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 1,
                "entrada_real": "07:31",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "47644021",
                "nombre": "LILEY DANITZA",
                "apellidos": "CONDORI CHAHUAYHUA",
                "dia": "2025-09-02",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 4,
                "entrada_real": "07:34",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "47644021",
                "nombre": "LILEY DANITZA",
                "apellidos": "CONDORI CHAHUAYHUA",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 9,
                "entrada_real": "07:39",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72144100",
                "nombre": "GUSTAVO ALVARO",
                "apellidos": "HUARACCALLO QUISPE",
                "dia": "2025-09-01",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 2,
                "entrada_real": "07:32",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72144100",
                "nombre": "GUSTAVO ALVARO",
                "apellidos": "HUARACCALLO QUISPE",
                "dia": "2025-09-02",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 2,
                "entrada_real": "07:32",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72144100",
                "nombre": "GUSTAVO ALVARO",
                "apellidos": "HUARACCALLO QUISPE",
                "dia": "2025-09-03",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 8,
                "entrada_real": "07:38",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "29418196",
                "nombre": "NIEVES",
                "apellidos": "COLCA QQUESOTA",
                "dia": "2025-09-01",
                "turno": "LIMPIEZA 5:00-15:00 \/ S. 5:00-12:30 ",
                "atraso": 3,
                "entrada_real": "05:03",
                "entrada": "05:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "29418196",
                "nombre": "NIEVES",
                "apellidos": "COLCA QQUESOTA",
                "dia": "2025-09-02",
                "turno": "LIMPIEZA 5:00-15:00 \/ S. 5:00-12:30 ",
                "atraso": 3,
                "entrada_real": "05:03",
                "entrada": "05:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "45456142",
                "nombre": "ALEXANDER PERCY",
                "apellidos": "URQUIZO HERRERA",
                "dia": "2025-09-01",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 26,
                "entrada_real": "07:26",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "45456142",
                "nombre": "ALEXANDER PERCY",
                "apellidos": "URQUIZO HERRERA",
                "dia": "2025-09-03",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 13,
                "entrada_real": "07:13",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72755038",
                "nombre": "KEVIN",
                "apellidos": "CALSIN PACHAU",
                "dia": "2025-09-02",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 3,
                "entrada_real": "07:33",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72755038",
                "nombre": "KEVIN",
                "apellidos": "CALSIN PACHAU",
                "dia": "2025-09-03",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 5,
                "entrada_real": "07:35",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73483002",
                "nombre": "SALOMON",
                "apellidos": "FERNANDEZ PARENTE",
                "dia": "2025-09-01",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 13,
                "entrada_real": "07:43",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73483002",
                "nombre": "SALOMON",
                "apellidos": "FERNANDEZ PARENTE",
                "dia": "2025-09-02",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 4,
                "entrada_real": "07:34",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "48409306",
                "nombre": "JUAN LUIS",
                "apellidos": "PACCO HUARSOCCA",
                "dia": "2025-09-02",
                "turno": "ALMAC\u00c9N NOCHE 21:00-6:00 \/ S. 21:00-6:00",
                "atraso": 35,
                "entrada_real": "21:35",
                "entrada": "21:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70102322",
                "nombre": "JAVIER ROMARIO",
                "apellidos": "SAGUANAYA CABANA",
                "dia": "2025-09-01",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 11,
                "entrada_real": "07:41",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70102322",
                "nombre": "JAVIER ROMARIO",
                "apellidos": "SAGUANAYA CABANA",
                "dia": "2025-09-02",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 2,
                "entrada_real": "07:32",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70102322",
                "nombre": "JAVIER ROMARIO",
                "apellidos": "SAGUANAYA CABANA",
                "dia": "2025-09-03",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 4,
                "entrada_real": "07:34",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71066690",
                "nombre": "JUAN JHARLES",
                "apellidos": "USHI\u00d1AHUA ZATALAYA",
                "dia": "2025-09-02",
                "turno": "DESPACHO ALMAC\u00c9N D\u00cdA 7:00-17:00 \/ S. 7:00-14:30\t",
                "atraso": 17,
                "entrada_real": "07:17",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75186246",
                "nombre": "DAVID",
                "apellidos": "ROJAS MAMANI",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 8,
                "entrada_real": "07:38",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75186246",
                "nombre": "DAVID",
                "apellidos": "ROJAS MAMANI",
                "dia": "2025-09-02",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 2,
                "entrada_real": "07:32",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75186246",
                "nombre": "DAVID",
                "apellidos": "ROJAS MAMANI",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 12,
                "entrada_real": "07:42",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "47865240",
                "nombre": "PAUL CARLOS",
                "apellidos": "HERRERA PEREZ",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 5,
                "entrada_real": "08:05",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "47865240",
                "nombre": "PAUL CARLOS",
                "apellidos": "HERRERA PEREZ",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 6,
                "entrada_real": "08:06",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "47865240",
                "nombre": "PAUL CARLOS",
                "apellidos": "HERRERA PEREZ",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 26,
                "entrada_real": "08:26",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70296660",
                "nombre": "MELANIE NAHALIEL",
                "apellidos": "TACO FLOREZ",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 7,
                "entrada_real": "07:37",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70296660",
                "nombre": "MELANIE NAHALIEL",
                "apellidos": "TACO FLOREZ",
                "dia": "2025-09-02",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 2,
                "entrada_real": "07:32",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70296660",
                "nombre": "MELANIE NAHALIEL",
                "apellidos": "TACO FLOREZ",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 12,
                "entrada_real": "07:42",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "47928175",
                "nombre": "JAVIER  ALEJANDRO",
                "apellidos": "TOTOCAYO VERA",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 3,
                "entrada_real": "07:33",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "48060664",
                "nombre": "HELBERT FREDY",
                "apellidos": "NIFLA MANANI",
                "dia": "2025-09-02",
                "turno": "ALMAC\u00c9N NOCHE 21:00-6:00 \/ S. 21:00-6:00",
                "atraso": 43,
                "entrada_real": "21:43",
                "entrada": "21:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75510176",
                "nombre": "FIORELA",
                "apellidos": "JIHUALLANCA APAZA",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 10,
                "entrada_real": "08:10",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75510176",
                "nombre": "FIORELA",
                "apellidos": "JIHUALLANCA APAZA",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 17,
                "entrada_real": "08:17",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75510176",
                "nombre": "FIORELA",
                "apellidos": "JIHUALLANCA APAZA",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 19,
                "entrada_real": "08:19",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70391302",
                "nombre": "GABRIEL ADRIAN",
                "apellidos": "LIMACHE CAYETANO",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 3,
                "entrada_real": "07:33",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70391302",
                "nombre": "GABRIEL ADRIAN",
                "apellidos": "LIMACHE CAYETANO",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 3,
                "entrada_real": "07:33",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70391302",
                "nombre": "GABRIEL ADRIAN",
                "apellidos": "LIMACHE CAYETANO",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 15,
                "entrada_real": "07:45",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "77807851",
                "nombre": "JHON KLEYNER",
                "apellidos": "MAYTA LAURA",
                "dia": "2025-09-02",
                "turno": "ALMACEN NOCHE 20:30 PM - 5:30 AM",
                "atraso": 14,
                "entrada_real": "20:44",
                "entrada": "20:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "77807851",
                "nombre": "JHON KLEYNER",
                "apellidos": "MAYTA LAURA",
                "dia": "2025-09-03",
                "turno": "ALMACEN NOCHE 20:30 PM - 5:30 AM",
                "atraso": 3,
                "entrada_real": "20:33",
                "entrada": "20:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72136973",
                "nombre": "EDUARDO BENIGNO",
                "apellidos": "UTURUNCO HEREDIA",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 1,
                "entrada_real": "08:01",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72136973",
                "nombre": "EDUARDO BENIGNO",
                "apellidos": "UTURUNCO HEREDIA",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 11,
                "entrada_real": "08:11",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70182448",
                "nombre": "JOSE SANTOS",
                "apellidos": "BAUTISTA PINTO",
                "dia": "2025-09-02",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 18,
                "entrada_real": "07:18",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73248345",
                "nombre": "GIOVANNHY",
                "apellidos": "CATUNTA PALOMINO",
                "dia": "2025-09-01",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 15,
                "entrada_real": "07:45",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73248345",
                "nombre": "GIOVANNHY",
                "apellidos": "CATUNTA PALOMINO",
                "dia": "2025-09-02",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 14,
                "entrada_real": "07:44",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73248345",
                "nombre": "GIOVANNHY",
                "apellidos": "CATUNTA PALOMINO",
                "dia": "2025-09-03",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 9,
                "entrada_real": "07:39",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72393396",
                "nombre": "CATHERINE DARIA",
                "apellidos": "MAQUE HURTADO",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 1,
                "entrada_real": "08:01",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72393396",
                "nombre": "CATHERINE DARIA",
                "apellidos": "MAQUE HURTADO",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 4,
                "entrada_real": "08:04",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74662930",
                "nombre": "YOSIMARA",
                "apellidos": "LARICO CHAMPI",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 13,
                "entrada_real": "07:43",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74662930",
                "nombre": "YOSIMARA",
                "apellidos": "LARICO CHAMPI",
                "dia": "2025-09-02",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 4,
                "entrada_real": "07:34",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74662930",
                "nombre": "YOSIMARA",
                "apellidos": "LARICO CHAMPI",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 16,
                "entrada_real": "07:46",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72250706",
                "nombre": "ALBERT JESUS",
                "apellidos": "RIVERA APAZA",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 5,
                "entrada_real": "07:35",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72528926",
                "nombre": "RAM\u00d3N JUAN",
                "apellidos": "QUISPE SALINAS",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 1,
                "entrada_real": "07:31",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74319533",
                "nombre": "DAVID WILLIAN",
                "apellidos": "CHA\u00d1I HUAMANI",
                "dia": "2025-09-01",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 10,
                "entrada_real": "07:10",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74319533",
                "nombre": "DAVID WILLIAN",
                "apellidos": "CHA\u00d1I HUAMANI",
                "dia": "2025-09-02",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 13,
                "entrada_real": "07:13",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74319533",
                "nombre": "DAVID WILLIAN",
                "apellidos": "CHA\u00d1I HUAMANI",
                "dia": "2025-09-03",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 5,
                "entrada_real": "07:05",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71842859",
                "nombre": "ALONSO",
                "apellidos": "MARTINEZ CASTILLO",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 7:30-17:00 \/ S. 7:30-14:30",
                "atraso": 11,
                "entrada_real": "07:41",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71842859",
                "nombre": "ALONSO",
                "apellidos": "MARTINEZ CASTILLO",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 7:30-17:00 \/ S. 7:30-14:30",
                "atraso": 1,
                "entrada_real": "07:31",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "76868405",
                "nombre": "JUAN DIEGO",
                "apellidos": "SARAVIA PINTO",
                "dia": "2025-09-01",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 3,
                "entrada_real": "07:03",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "76868405",
                "nombre": "JUAN DIEGO",
                "apellidos": "SARAVIA PINTO",
                "dia": "2025-09-02",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 3,
                "entrada_real": "07:03",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "76821398",
                "nombre": "MARIA ALEJANDRA",
                "apellidos": "MARIN BERNAL",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 6,
                "entrada_real": "07:36",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "76821398",
                "nombre": "MARIA ALEJANDRA",
                "apellidos": "MARIN BERNAL",
                "dia": "2025-09-02",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 221,
                "entrada_real": "11:11",
                "entrada": "07:30",
                "momento_revision": false,
                "aprobador": "ALONSO MARTINEZ CASTILLO",
                "observaciones": "ATENCION EN ESSALUD",
                "tolerancia": 0
            },
            {
                "identificacion": "76821398",
                "nombre": "MARIA ALEJANDRA",
                "apellidos": "MARIN BERNAL",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 32,
                "entrada_real": "08:02",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72656145",
                "nombre": "LIZETH MARIELA",
                "apellidos": "MEDINA MONTESINOS",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVO ",
                "atraso": 12,
                "entrada_real": "08:12",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75866363",
                "nombre": "JHON FRANKLIN",
                "apellidos": "CAHUATA CABRERA",
                "dia": "2025-09-01",
                "turno": "HORARIO TURNO NOCHE MOQUEGUA (DESCANSO SABADO)",
                "atraso": 6,
                "entrada_real": "20:06",
                "entrada": "20:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "63564922",
                "nombre": "JUAN CARLOS",
                "apellidos": "CUTIPA QUISPE",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 233,
                "entrada_real": "11:23",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74242974",
                "nombre": "CRISTIAN BERNARDO",
                "apellidos": "AROTAYPE CCALACHUA",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 1,
                "entrada_real": "08:01",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "43846199",
                "nombre": "VER\u00d3NICA FABIOLA",
                "apellidos": "MIRANDA HUAMAN",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 4,
                "entrada_real": "08:04",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "43846199",
                "nombre": "VER\u00d3NICA FABIOLA",
                "apellidos": "MIRANDA HUAMAN",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 3,
                "entrada_real": "08:03",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "77084214",
                "nombre": "CLEOFE",
                "apellidos": "CHAVEZ CONDORI",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 7,
                "entrada_real": "07:37",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "77084214",
                "nombre": "CLEOFE",
                "apellidos": "CHAVEZ CONDORI",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 5,
                "entrada_real": "07:35",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "77907145",
                "nombre": "FABIAN VLADIMIR",
                "apellidos": "FLOREZ AGUILAR",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 3,
                "entrada_real": "08:03",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70326247",
                "nombre": "GIANCARLO ANDRES",
                "apellidos": "CHALCO ORTEGA",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 2,
                "entrada_real": "07:32",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70326247",
                "nombre": "GIANCARLO ANDRES",
                "apellidos": "CHALCO ORTEGA",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 16,
                "entrada_real": "07:46",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74319699",
                "nombre": "LUIS ANGEL",
                "apellidos": "MARTINEZ SOLIS",
                "dia": "2025-09-02",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 30,
                "entrada_real": "07:30",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73189290",
                "nombre": "PRICSILA",
                "apellidos": "GUEVARA GONZALES",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 8,
                "entrada_real": "08:08",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73189290",
                "nombre": "PRICSILA",
                "apellidos": "GUEVARA GONZALES",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 3,
                "entrada_real": "08:03",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73189290",
                "nombre": "PRICSILA",
                "apellidos": "GUEVARA GONZALES",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 17,
                "entrada_real": "08:17",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "77475248",
                "nombre": "ALEXANDER HENRY",
                "apellidos": "JA\u00d1O SULLCA",
                "dia": "2025-09-01",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 25,
                "entrada_real": "07:25",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "77475248",
                "nombre": "ALEXANDER HENRY",
                "apellidos": "JA\u00d1O SULLCA",
                "dia": "2025-09-02",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 24,
                "entrada_real": "07:24",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "77475248",
                "nombre": "ALEXANDER HENRY",
                "apellidos": "JA\u00d1O SULLCA",
                "dia": "2025-09-03",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 21,
                "entrada_real": "07:21",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "44507695",
                "nombre": "MIGUEL JOSE",
                "apellidos": "HACHAHUI SOTO",
                "dia": "2025-09-03",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 2,
                "entrada_real": "07:02",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71317383",
                "nombre": "DIEGO JESUS",
                "apellidos": "AGUILAR BAUTISTA",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 24,
                "entrada_real": "08:24",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71317383",
                "nombre": "DIEGO JESUS",
                "apellidos": "AGUILAR BAUTISTA",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 17,
                "entrada_real": "08:17",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71317383",
                "nombre": "DIEGO JESUS",
                "apellidos": "AGUILAR BAUTISTA",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 10,
                "entrada_real": "08:10",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72667941",
                "nombre": "EVELYN",
                "apellidos": "HUAMANI PHOCCO",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 1,
                "entrada_real": "08:01",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "76564298",
                "nombre": "MARIA MERCEDES",
                "apellidos": "ROJAS RAMOS",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 2,
                "entrada_real": "07:32",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "76564298",
                "nombre": "MARIA MERCEDES",
                "apellidos": "ROJAS RAMOS",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 8,
                "entrada_real": "07:38",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75168418",
                "nombre": "HECTOR",
                "apellidos": "ZAPANA LIVISI",
                "dia": "2025-09-01",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 18,
                "entrada_real": "07:48",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75168418",
                "nombre": "HECTOR",
                "apellidos": "ZAPANA LIVISI",
                "dia": "2025-09-02",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 12,
                "entrada_real": "07:42",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75168418",
                "nombre": "HECTOR",
                "apellidos": "ZAPANA LIVISI",
                "dia": "2025-09-03",
                "turno": "ALMAC\u00c9N D\u00cdA 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 18,
                "entrada_real": "07:48",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "74978786",
                "nombre": "YAMILE ARACELI",
                "apellidos": "APAZA FLORES",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 4,
                "entrada_real": "08:04",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75446179",
                "nombre": "BRYSON ALDAIR",
                "apellidos": "NEYRA OSCCO",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 3,
                "entrada_real": "08:03",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "48314001",
                "nombre": "PAULO CESAR",
                "apellidos": "ROSAS GUILLEN",
                "dia": "2025-09-02",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 9,
                "entrada_real": "07:09",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "48314001",
                "nombre": "PAULO CESAR",
                "apellidos": "ROSAS GUILLEN",
                "dia": "2025-09-03",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 10,
                "entrada_real": "07:10",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73941892",
                "nombre": "MILUSKA",
                "apellidos": "DAVILA MELENDEZ",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 6,
                "entrada_real": "07:36",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73941892",
                "nombre": "MILUSKA",
                "apellidos": "DAVILA MELENDEZ",
                "dia": "2025-09-02",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 7,
                "entrada_real": "07:37",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "73941892",
                "nombre": "MILUSKA",
                "apellidos": "DAVILA MELENDEZ",
                "dia": "2025-09-03",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 6,
                "entrada_real": "07:36",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72155314",
                "nombre": "SHERLEY",
                "apellidos": "LEANDRO YUCA",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 14,
                "entrada_real": "08:14",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72155314",
                "nombre": "SHERLEY",
                "apellidos": "LEANDRO YUCA",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 6,
                "entrada_real": "08:06",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72155314",
                "nombre": "SHERLEY",
                "apellidos": "LEANDRO YUCA",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 10,
                "entrada_real": "08:10",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71405769",
                "nombre": "JOEL JASON",
                "apellidos": "ATAMARI AGUILAR",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 337,
                "entrada_real": "13:37",
                "entrada": "08:00",
                "momento_revision": false,
                "aprobador": "ALONSO MARTINEZ CASTILLO",
                "observaciones": "AUTORIZA SR JAIME - POR TEMA PERSONAL",
                "tolerancia": 0
            },
            {
                "identificacion": "71405769",
                "nombre": "JOEL JASON",
                "apellidos": "ATAMARI AGUILAR",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 5,
                "entrada_real": "08:05",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "71405769",
                "nombre": "JOEL JASON",
                "apellidos": "ATAMARI AGUILAR",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 36,
                "entrada_real": "08:36",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72201231",
                "nombre": "OMAR ANDERSON",
                "apellidos": "HUILLCA LLANOS",
                "dia": "2025-09-01",
                "turno": "MEGAFLOTAS 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 4,
                "entrada_real": "07:04",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "70666970",
                "nombre": "JOSUE FABRICIO",
                "apellidos": "MEDINA BELTRAN",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 3,
                "entrada_real": "07:33",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72321899",
                "nombre": "EVELYN",
                "apellidos": "CACERES CHUQUIRIMAY",
                "dia": "2025-09-01",
                "turno": "MEGAFLOTAS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 3,
                "entrada_real": "08:03",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72321899",
                "nombre": "EVELYN",
                "apellidos": "CACERES CHUQUIRIMAY",
                "dia": "2025-09-02",
                "turno": "MEGAFLOTAS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 149,
                "entrada_real": "10:29",
                "entrada": "08:00",
                "momento_revision": false,
                "aprobador": "ALONSO MARTINEZ CASTILLO",
                "observaciones": "AUTORIZA FIORELA",
                "tolerancia": 0
            },
            {
                "identificacion": "73885006",
                "nombre": "FRANCO AMILCAR",
                "apellidos": "PAUCCAR AGUILAR",
                "dia": "2025-09-01",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 20,
                "entrada_real": "07:50",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "72605850",
                "nombre": "THANIA",
                "apellidos": "ALARCON CONDORI",
                "dia": "2025-09-02",
                "turno": "TIENDAS 7:30-17:30 \/ S. 7:30-15:00",
                "atraso": 1,
                "entrada_real": "07:31",
                "entrada": "07:30",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "61258280",
                "nombre": "BRAYAN SAMIR",
                "apellidos": "HUAHUACCAPA CCAHUA",
                "dia": "2025-09-03",
                "turno": "ALMAC\u00c9N NOCHE 21:00-6:00 \/ S. 21:00-6:00",
                "atraso": 2,
                "entrada_real": "21:02",
                "entrada": "21:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75263088",
                "nombre": "ANGELICA",
                "apellidos": "FLORES BENITO",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 8,
                "entrada_real": "08:08",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "43339946",
                "nombre": "ALAN",
                "apellidos": "BONIFACIO CAMALA",
                "dia": "2025-09-01",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 6,
                "entrada_real": "07:06",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "43339946",
                "nombre": "ALAN",
                "apellidos": "BONIFACIO CAMALA",
                "dia": "2025-09-02",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 1,
                "entrada_real": "07:01",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "43339946",
                "nombre": "ALAN",
                "apellidos": "BONIFACIO CAMALA",
                "dia": "2025-09-03",
                "turno": "DISTRIBUCI\u00d3N 7:00-17:00 \/ S. 7:00-14:30",
                "atraso": 5,
                "entrada_real": "07:05",
                "entrada": "07:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "75279700",
                "nombre": "LUIS GERARDO",
                "apellidos": "LEON VELASQUEZ",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 136,
                "entrada_real": "10:16",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "45560642",
                "nombre": "FERNANDO RAUL",
                "apellidos": "SUPO RAMOS",
                "dia": "2025-09-01",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 4,
                "entrada_real": "08:04",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "45560642",
                "nombre": "FERNANDO RAUL",
                "apellidos": "SUPO RAMOS",
                "dia": "2025-09-02",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 7,
                "entrada_real": "08:07",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            },
            {
                "identificacion": "45560642",
                "nombre": "FERNANDO RAUL",
                "apellidos": "SUPO RAMOS",
                "dia": "2025-09-03",
                "turno": "ADMINISTRATIVOS 8:00-17:30 \/ S. 8:00-15:00",
                "atraso": 4,
                "entrada_real": "08:04",
                "entrada": "08:00",
                "momento_revision": null,
                "aprobador": null,
                "observaciones": null,
                "tolerancia": 0
            }
        ]
        // this.tardanzas.set(data);

        // this.tardanzaService.getTardanzas(fi, ff).then((data) => {
        //     this.tardanzas.set(data);
        // });

        this.tardanzaService.getTardanzasGrupo(fi, ff).then((data) => {
              const mapped = (data as any[]).map(g => ({
    ...g,
    // si el backend ya manda un array en g.tardanzasBuk lo usamos, si no, lo inicializamos vacio
    tardanzasBuk: signal<TardanzasBuk | undefined>(g.tardanzasBuk ?? null)
  })) as GrupoTardanzasBuk[];

  this.tardanzasGrupo.set(mapped);
            // this.tardanzasGrupo.set(data);
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.tardanza = {};
        this.submitted = false;
        this.tardanzaDialog = true;
    }

    editTardanza(tardanza: Tardanza) {
        this.tardanza = { ...tardanza };
        this.tardanzaDialog = true;
    }

    deleteSelectedTardanzas() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected tardanzas?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tardanzas.set(this.tardanzas().filter((val) => !this.selectedTardanzas?.includes(val)));
                this.selectedTardanzas = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Tardanzas Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.tardanzaDialog = false;
        this.submitted = false;
    }

    deleteTardanza(tardanza: Tardanza) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + tardanza.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tardanzas.set(this.tardanzas().filter((val) => val.id !== tardanza.id));
                this.tardanza = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Tardanza Deleted',
                    life: 3000
                });
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.tardanzas().length; i++) {
            if (this.tardanzas()[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warn';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'info';
        }
    }



    saveTardanza() {
        this.submitted = true;
        let _tardanzas = this.tardanzas();
        if (this.tardanza.name?.trim()) {
            if (this.tardanza.id) {
                _tardanzas[this.findIndexById(this.tardanza.id)] = this.tardanza;
                this.tardanzas.set([..._tardanzas]);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Tardanza Updated',
                    life: 3000
                });
            } else {
                this.tardanza.id = this.createId();
                this.tardanza.image = 'tardanza-placeholder.svg';
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Tardanza Created',
                    life: 3000
                });
                this.tardanzas.set([..._tardanzas, this.tardanza]);
            }

            this.tardanzaDialog = false;
            this.tardanza = {};
        }
    }
}
