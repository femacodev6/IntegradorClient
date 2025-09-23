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
import { SoloHoraPipe } from '../../pipes/date-hora';
import { SoloFechaPipe } from '../../pipes/date-fecha';
import { FechaLargaPipe } from '../../pipes/date-fecha-pretty';
import { Chip } from 'primeng/chip';
import { Badge } from 'primeng/badge';
import { WritableSignal } from '@angular/core';
import { Menu } from 'primeng/menu';

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
    FechaCortaPipe,
    FechaLargaPipe,
    SoloHoraPipe,
    SoloFechaPipe,
    Chip,
    Badge,
    Menu
  ],
  templateUrl: './permisos.html',
  providers: [PermisoService, ConfirmationService]
})


export class Permisos implements OnInit {

  fechaInicio = signal<Date | null>(null);

  fechaFin = signal<Date | null>(null);

  rangeDates = signal<Date[]>([]);

  permisoDialog: boolean = false;

  unionTodosBukInntegra = signal<UnionTodosBukInntegra[]>([]);

  // permisosGrupo = signal<GrupoPermisosBuk[]>([]);

  permiso!: UnionTodosBukInntegra;


  menuItems: any[] = [];

  openMenu(event: Event, row: any, menu: any) {

    this.menuItems = [
      {
        label: 'compensacion por horas femaco',
        command: () => this.cambiarTipoPermiso(row.rowIndex, "compensacion_por_horas_femaco", row.permiso.tipoDePermiso)
      },
      {
        label: 'compensacion por dias',
        command: () => this.cambiarTipoPermiso(row.rowIndex, "compensacion_por_dias", row.permiso.tipoDePermiso)
      }
    ];


    menu.toggle(event);
  }

  openMenuInasistencia(event: Event, row: any, menu: any) {
    this.menuItems = [
      {
        label: 'inasistencia',
        command: () => this.cambiarTipoPermiso(row.rowIndex, "inasistencia", row.permiso.tipoDePermiso)
      },
      {
        label: 'cese',
        command: () => this.cambiarTipoPermiso(row.rowIndex, "cese", row.permiso.tipoDePermiso)
      }
    ];

    menu.toggle(event);
  }

  cambiarTipoPermiso(index: number, tipoDePermisoAlternativo: string, tipoDePermiso: string) {
    const lista = this.unionTodosBukInntegra();
    if (!lista) return;

    const item = lista[index];
    if (!item?.permiso?.tipoDePermisoAlternativo) return;
    if (tipoDePermisoAlternativo == tipoDePermiso) {

      item.permiso.tipoDePermisoAlternativo.set(null);
    } else {

      item.permiso.tipoDePermisoAlternativo.set(tipoDePermisoAlternativo);
    }
  }

  submitted: boolean = false;

  statuses!: any[];

  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];
  expandedRows = {};

  constructor(
    private permisoService: PermisoService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  selectedMotivo: number | null = null;

  private formatDate(d: Date | null): string {
    if (!d) return '';
    const y = d.getFullYear();
    const m = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${y}-${m}-${day}`;
  }

  bukTipoPermiso(todosBuk: any) {
    const permiso = todosBuk?.permiso
    const licencia = todosBuk?.licencia
    const inasistencia = todosBuk?.inasistencia
    if (permiso) return permiso.permissionTypeCode
    if (licencia) return licencia.licenceTypeCode
    if (inasistencia) return inasistencia.absenceTypeCode
    return ''
  }
  bukPagado(todosBuk: any) {
    const permiso = todosBuk?.permiso
    const licencia = todosBuk?.licencia
    const inasistencia = todosBuk?.inasistencia
    if (permiso) return permiso.paid
    if (licencia) return true
    if (inasistencia) return false
    return null
  }
  bukStartTime(todosBuk: any) {
    const permiso = todosBuk?.permiso
    const licencia = todosBuk?.licencia
    const inasistencia = todosBuk?.inasistencia
    if (permiso) return permiso.startTime
    if (licencia) return licencia.startTime
    if (inasistencia) return inasistencia.startTime
    return null
  }
  bukEndTime(todosBuk: any) {
    const permiso = todosBuk?.permiso
    const licencia = todosBuk?.licencia
    const inasistencia = todosBuk?.inasistencia
    if (permiso) return permiso.endTime
    if (licencia) return licencia.endTime
    if (inasistencia) return inasistencia.endTime
    return null
  }

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

  estados = [
    { id: 1, nombre: "Inngresa - Nulo", severity: "secondary" },
    { id: 2, nombre: "Nulo - Buk", severity: "secondary" },
    { id: 3, nombre: "Iguales", severity: "success" },
    { id: 4, nombre: "Difieren", severity: "warn" }
  ]
  //////
  selectedPermisos!: UnionTodosBukInntegra[] | [];
  tiposPermisoSelected = signal<string | null>(null);
  estadosSelected = signal<string | null>(null);
  dniFilter = signal<string | null>(null);
  // 0) antes dni
  unionTodosBukInntegraFilterDni = computed(() => {
    return this.unionTodosBukInntegraEstado().filter(ut => {
      const filter = (this.dniFilter() ?? '').toLowerCase();

      const todos = typeof ut.todosBuk === 'function'
        ? ut.todosBuk()  // es un signal
        : ut.todosBuk;   // es un objeto o null

      return (
        ut.permiso?.identificacion?.toString().toLowerCase().includes(filter) ||
        todos?.dni?.toString().toLowerCase().includes(filter) ||
        ut.permiso?.fullname?.toString().toLowerCase().includes(filter) ||
        todos?.fullname?.toString().toLowerCase().includes(filter)
      );
    })
  })
  // 1) Un único computed que devuelve las tres vistas
  unionTodosBukInntegraFilters = computed(() => {
    const all = this.unionTodosBukInntegraFilterDni();
    const tiposPermiso = this.tiposPermisoSelected();
    const estado = this.estadosSelected();

    const byTiposPermiso: typeof all = [];
    const byEstado: typeof all = [];
    const both: typeof all = [];

    for (const tg of all) {
      const hasTiposPermiso = !tiposPermiso || tg.permiso?.tipoDePermiso == tiposPermiso;
      const hasEstado = !estado || tg.estado?.id == parseInt(estado);

      if (hasTiposPermiso) byTiposPermiso.push(tg);
      if (hasEstado) byEstado.push(tg);
      if (hasTiposPermiso && hasEstado) both.push(tg);
    }

    return { all, byTiposPermiso, byEstado, both };
  });

  // 2) Reutilizar el resultado para exponer los filtros individuales (muy baratos)
  unionTodosBukInntegraFilter = computed(() => this.unionTodosBukInntegraFilters().both);
  unionTodosBukInntegraFilterTiposPermiso = computed(() => this.unionTodosBukInntegraFilters().byTiposPermiso);
  unionTodosBukInntegraFilterEstado = computed(() => this.unionTodosBukInntegraFilters().byEstado);

  // 3) turnos — contar usando Map, recorrido único sobre los turnos relevantes
  tiposPermiso = computed(() => {
    const map = new Map<string, number>();
    for (const g of this.unionTodosBukInntegraFilterEstado()) {
      if (g.permiso?.tipoDePermiso != null && g.permiso?.tipoDePermiso !== '') {
        map.set(g.permiso?.tipoDePermiso, (map.get(g.permiso?.tipoDePermiso) ?? 0) + 1);
      }
    }

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));
  });

  // 4) comparacionsCantidad — construir un mapa de conteos y mapear comparacions (O(n + m))
  estadosCantidad = computed(() => {
    const counts = new Map<any, number>();
    for (const tf of this.unionTodosBukInntegraFilterTiposPermiso()) {
      const id = tf.estado?.id;
      if (id != null) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    return this.estados.map(c => ({ ...c, cantidad: counts.get(c.id) ?? 0 }));
  });

  unionTodosBukInntegraEstado = computed(() => {
    return this.unionTodosBukInntegra().map((uni, index) => {
      const inngresa = uni.permiso
      const buk = (uni.todosBuk as WritableSignal<TodosBuk | null>)!();

      if (!inngresa)
        return { ...uni, rowIndex: index, estado: this.estados.find(c => c.id == 2) }
      if (!buk)
        return { ...uni, rowIndex: index, estado: this.estados.find(c => c.id == 1) }
      if (inngresa.tipoDePermiso == this.bukTipoPermiso(buk))
        return { ...uni, rowIndex: index, estado: this.estados.find(c => c.id == 3) }
      return { ...uni, rowIndex: index, estado: this.estados.find(c => c.id == 4) }
    })
  });

  //////
  totalPermisos = computed(() => {
    return this.unionTodosBukInntegraFilter().length
  })

  setMesActual() {
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    this.fechaInicio.set(inicio);
    this.fechaFin.set(fin);
    this.rangeDates.set([inicio, fin]);

  }

  setMesAnterior() {
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    this.fechaInicio.set(inicio);
    this.fechaFin.set(fin);
    this.rangeDates.set([inicio, fin]);
  }

  onIdentificacionClick(identificacion: string) {
    console.log(identificacion);

    this.dniFilter.set(identificacion.toString())
  }

  permisosToBukVolcar() {
    const permisos = this.selectedPermisos
      .map(sel => sel?.permiso)
      .filter((p): p is PermisosModelos => !!p)
    this.permisoService.postPermisosBatch(permisos).then((data) => {
      this.selectedPermisos = []

      const exitosos = data.items.filter((req: any) => {
        return req.success == true
      })
      exitosos.forEach((exitoso: any) => {
        if (exitoso.permisoResponse) {
          const permiso = exitoso.permisoResponse.permission
          const index = this.unionTodosBukInntegra().findIndex(unionTodo => {
            return unionTodo.permiso?.hash == permiso.hash
          })
          const item = this.unionTodosBukInntegra()[index];
          if (!item) return;
          const { paid, permissionTypeId, permissionTypeCode, timeMeasure, startTime, endTime, ...rest } = permiso
          const permisoSet = {
            ...rest,
            licencia: null,
            inasistencia: null,
            permiso: {
              paid, permissionTypeId, permissionTypeCode, timeMeasure, startTime, endTime
            }
          };
          (item?.todosBuk as WritableSignal<TodosBuk | null>)?.set(permisoSet ?? null);
        }
        if (exitoso.inasistenciaResponse) {
          const inasistencia = exitoso.inasistenciaResponse.absence
          const index = this.unionTodosBukInntegra().findIndex(unionTodo => {
            return unionTodo.permiso?.hash == inasistencia.hash
          })
          const item = this.unionTodosBukInntegra()[index];
          if (!item) return;
          const { absenceTypeId, absenceTypeCode, ...rest } = inasistencia
          const inasistenciaSet = {
            ...rest,
            licencia: null,
            permiso: null,
            inasistencia: {
              absenceTypeId, absenceTypeCode
            }
          };
          (item?.todosBuk as WritableSignal<TodosBuk | null>)?.set(inasistenciaSet ?? null);
        }
        if (exitoso.licenciaResponse) {
          const licencia = exitoso.licenciaResponse.licence
          const index = this.unionTodosBukInntegra().findIndex(unionTodo => {
            return unionTodo.permiso?.hash == licencia.hash
          })
          const item = this.unionTodosBukInntegra()[index];
          if (!item) return;
          const { licenceTypeId, format, type, motivo, medicRut, licenceTypeCode, licenceNumber, medicName, ...rest } = licencia
          const licenciaSet = {
            ...rest,
            inasistencia: null,
            permiso: null,
            licencia: {
              licenceTypeId, format, type, motivo, medicRut, licenceTypeCode, licenceNumber, medicName
            }
          };
          (item?.todosBuk as WritableSignal<TodosBuk | null>)?.set(licenciaSet ?? null);
        }
      })

      const fallidos = data.items.filter((req: any) => {
        return req.success == false
      }).map((fail: any) => {
        return {
          empleado: fail.employeeId,
          stack: fail.errorResponseDetalle.message
        }
      })

      const erroneos = data.total - data.succeeded
      let detalle
      let severidad
      let sumario
      let sticky
      if (data.total == data.succeeded) {
        detalle = data.succeeded + ' permisos traspasadas a Buk'
        severidad = 'success'
        sumario = 'Éxito total'
        sticky = false
      }
      if (erroneos != data.total && data.total > data.succeeded) {
        detalle = data.succeeded + ' permisos traspasadas a Buk, ' + erroneos + ' permisos fallidas, ' + JSON.stringify(fallidos, null, 2)
        severidad = 'warn'
        sumario = 'Éxito parcial'
        sticky = true
      }
      if (erroneos == data.total) {
        // detalle = erroneos + ' permisos fallidas, ' + JSON.stringify(fallidos, null, 2)
        detalle =
          `${data.succeeded} permisos traspasadas a Buk, ${erroneos} permisos fallidas` +
          (erroneos > 0
            ? '\n\nDetalles:\n' + fallidos
              .map((f:any) => `Empleado: ${f.empleado}\nError: ${f.stack}`)
              .join('\n\n')
            : '');
        severidad = 'error'
        sumario = 'Fallo total'
        sticky = true
      }

      this.messageService.add({
        severity: severidad,
        summary: sumario,
        detail: detalle,
        life: 3000,
        sticky: sticky
      });
    })
      .catch((e) => {
        console.error(e);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo traspasar el volcado permisos a Buk ' + e.error.error,
          sticky: true
        });
      });
  }

  loadDemoData() {
    const fi = this.formatDate(this.rangeDates()[0]);
    const ff = this.formatDate(this.rangeDates()[1]);
    // const fi = this.formatDate(this.fechaInicio());
    // const ff = this.formatDate(this.fechaFin());

    this.permisoService.getPermisos(fi, ff).then((data) => {

      // const mapped = (data.unionTodosBukInntegra as any[]).map(g => ({
      //   permiso: {
      //     ...g.permiso,
      //     tipoDePermisoAlternativo: signal<string | null>(g.permiso?.tipoDePermisoAlternativo ?? null)
      //   },
      //   // si el backend ya manda un array en g.tardanzasBuk lo usamos, si no, lo inicializamos vacio
      //   todosBuk: signal<TodosBuk | undefined>(g.todosBuk ?? null)
      // })) as UnionTodosBukInntegra[];

      const mapped = (data.unionTodosBukInntegra as any[]).map(g => ({
        permiso: g.permiso
          ? {
            ...g.permiso,
            tipoDePermisoAlternativo: signal<string | null>(g.permiso.tipoDePermisoAlternativo ?? null)
          }
          : null,
        todosBuk: signal<TodosBuk | undefined>(g.todosBuk ?? null)
      })) as UnionTodosBukInntegra[];

      this.unionTodosBukInntegra.set(mapped);

      const status = data.status
      if (status?.status == "ERROR") {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: status?.mensaje + " " + status?.reason,
          sticky: true
        });
      }
      else {
        this.messageService.add({
          severity: "success",
          summary: "Exito",
          detail: status?.mensaje,
          life: 3000
        });
      }
    })
      .catch((e) => {
        console.error(e);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo recibir respuesta' + e.error,
          sticky: true
        });
      });
  }
}
