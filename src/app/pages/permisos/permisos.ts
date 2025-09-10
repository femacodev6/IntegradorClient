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
        HoursToFriendlyPipe
    ],
    templateUrl: './permisos.html',
    providers: [MessageService, PermisoService, ConfirmationService]
})


export class Permisos implements OnInit {

    fechaInicio: Date | null = null;
    fechaFin: Date | null = null;

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

    private formatDate(d: Date | null): string {
        if (!d) return '';
        const y = d.getFullYear();
        const m = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return `${y}-${m}-${day}`;
    }

    // atrazoToBuk(index: number, groupedPermiso: GrupoPermisosBuk) {
    //     this.permisoService.postPermisosData(groupedPermiso, this.fechaInicio).then((data) => {
    //         const item = this.permisosGrupo()[index];
    //         if (!item) return;
    //         item?.permisosBuk?.set(data.ausencia);
    //     });
    // }

    loadDemoData() {
        const fi = this.formatDate(this.fechaInicio)+"T00:00";
        const ff = this.formatDate(this.fechaFin)+"T23:59";

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
