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

  permisoDialog: boolean = false;

  unionTodosBukInntegra = signal<UnionTodosBukInntegra[]>([]);

  // permisosGrupo = signal<GrupoPermisosBuk[]>([]);

  permiso!: UnionTodosBukInntegra;


  menuItems: any[] = [];

  openMenu(event: Event, row: any, menu: any) {

    this.menuItems = [
      {
        label: 'compensacion por dias',
        command: () => console.log("compensacion_por_dias")
      },
      {
        label: 'compensacion por horas femaco',
        command: () => console.log("compensacion_por_horas_femaco")
      }
    ];


    menu.toggle(event);
  }

  openMenuInasistencia(event: Event, row: any, menu: any) {
    console.log(row)
    this.menuItems = [
      {
        label: 'inasistencia',
        command: () => this.cambiarTipoPermiso(row.rowIndex, "inasistencia")
      },
      {
        label: 'cese',
        command: () => this.cambiarTipoPermiso(row.rowIndex, "cese")
      }
    ];


    menu.toggle(event);
  }

cambiarTipoPermiso(index: number, permiso: string) {
  const lista = this.unionTodosBukInntegra();
  if (!lista) return;

  const item = lista[index];
  if (!item?.permiso?.tipoDePermisoAlternativo) return;

  item.permiso.tipoDePermisoAlternativo.set(permiso);
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
    { id: 1, nombre: "solo inngresa", severity: "info" },
    { id: 2, nombre: "solo buk", severity: "warn" },
    { id: 3, nombre: "emparejado", severity: "success" },
    { id: 4, nombre: "discordante", severity: "danger" }
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
      return (
        ut.permiso?.identificacion?.toString().toLowerCase().includes(filter) ||
        // ut.todosBuk?.dni?.toString().toLowerCase().includes(filter) ||
        ut.permiso?.fullname?.toString().toLowerCase().includes(filter)
        // ut.todosBuk?.fullname?.toString().toLowerCase().includes(filter)
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
      // const buk = uni.todosBuk()
      const buk = (uni.todosBuk as WritableSignal<TodosBuk | null>)!();

      if (!inngresa)
        return { ...uni, rowIndex: index, estado: this.estados.find(c => c.id == 2) }
      if (!buk)
        return { ...uni, rowIndex: index, estado: this.estados.find(c => c.id == 1) }
      return { ...uni, rowIndex: index, estado: this.estados.find(c => c.id == 3) }
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
  }

  setMesAnterior() {
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    this.fechaInicio.set(inicio);
    this.fechaFin.set(fin);
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
        const permiso = exitoso.permisoResponse.permission
        const index = this.unionTodosBukInntegra().findIndex(unionTodo => {
          return unionTodo.permiso?.hash == permiso.hash
        })
        const item = this.unionTodosBukInntegra()[index];
        if (!item) return;
        // item?.todosBuk?.set(exitoso?.response?.permission ?? null);
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
      })

      const erroneos = data.total - data.succeeded
      let detalle
      let severidad
      let sumario
      if (data.total == data.succeeded) {
        detalle = data.succeeded + ' permisos traspasadas a Buk'
        severidad = 'success'
        sumario = 'Éxito total'
      }
      if (erroneos != data.total && data.total > data.succeeded) {
        detalle = data.succeeded + ' permisos traspasadas a Buk, ' + erroneos + ' permisos fallidas'
        severidad = 'warn'
        sumario = 'Éxito parcial'
      }
      if (erroneos == data.total) {
        detalle = erroneos + ' permisos fallidas'
        severidad = 'error'
        sumario = 'Fallo total'
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
          detail: 'No se pudo traspasar el volcado permisos a Buk ' + e.error.error,
          life: 4000
        });
      });
  }

  loadDemoData() {
    const fi = this.formatDate(this.fechaInicio());
    const ff = this.formatDate(this.fechaFin());

    this.permisoService.getPermisos(fi, ff).then((data) => {
      const mapped = (data as any[]).map(g => ({
        ...g,
        // si el backend ya manda un array en g.tardanzasBuk lo usamos, si no, lo inicializamos vacio
        todosBuk: signal<TodosBuk | undefined>(g.todosBuk ?? null)
      })) as UnionTodosBukInntegra[];

      this.unionTodosBukInntegra.set(mapped);
      // this.unionTodosBukInntegra.set(data);
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
