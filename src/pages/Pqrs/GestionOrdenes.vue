<template>
    <q-page class="q-pa-md bg-grey-2" style="min-height: 80vh;">
        <!-- Encabezado -->
        <div class="orders-header q-mb-md">
            <div class="text-h4 text-weight-bold text-blue-grey-10">Órdenes de Servicio</div>
            <div class="text-subtitle2 text-blue-grey-6">Gestiona y monitorea todas tus órdenes de servicio</div>
        </div>

        <!-- Buscador y filtros -->
        <div class="row items-center q-col-gutter-md q-mb-md">
            <div class="col-12">
                <q-input v-model="filtro" outlined dense debounce="250"
                    placeholder="Buscar por radicado, cliente o técnico…" class="search-input">
                    <template #prepend>
                        <q-icon name="search" />
                    </template>
                    <template #append>
                        <q-select v-model="estadoFiltro"
                            :options="['Pendiente', 'En validación', 'Aprobada', 'Devuelta']" dense borderless
                            emit-value map-options placeholder="Estado" style="min-width: 160px;" />
                    </template>
                </q-input>
            </div>
        </div>

        <!-- Listado de órdenes como tarjetas -->
        <div class="column q-gutter-md">
            <q-card v-for="(o, i) in ordenesFiltradas" :key="i" flat bordered class="cursor-pointer order-card" @click="verDetalle(o)">
                <q-card-section class="row items-start justify-between">
                    <div>
                        <div class="text-subtitle1 text-weight-bold">{{ o.CodigoRadicado }}</div>
                        <div class="text-body2 text-blue-grey-8 q-mt-xs">Técnico: {{ o.UsuarioTecnico || '—' }}</div>
                        <div class="row items-center text-blue-grey-7 q-mt-xs">
                            <q-icon name="event" size="16px" class="q-mr-xs" />
                            <span>Creada: {{ Utils.formatearFecha(o.FechaRadicado) }}</span>
                            <q-separator vertical inset class="q-ml-sm q-mr-sm" />
                            <q-icon name="schedule" size="16px" class="q-mr-xs" />
                            <span>Ejecución: {{ Utils.formatearFecha(o.FechaEjecucion) }}</span>
                        </div>
                    </div>
                    <div class="column items-end">
                        <q-badge align="middle" :color="'blue-7'" class="text-white text-caption badge-pill">{{
                            columnas[4].format ? columnas[4].format(o.EstadoSolicitud) : o.EstadoSolicitud }}</q-badge>
                    </div>
                </q-card-section>
                <q-separator />
               
            </q-card>
            <div v-if="ordenesFiltradas.length === 0" class="text-blue-grey-6 q-pt-xl q-pb-xl text-center">No hay
                órdenes que
                coincidan con la búsqueda.</div>
        </div>

        <!-- Detalle de la orden -->
        <q-dialog v-model="dialogoDetalle" maximized full-width>
            <q-card style="min-width: 400px">
                <div class="row items-center justify-between q-pa-md order-detail-header">
                    <div class="row items-center">
                        <q-btn flat dense round icon="arrow_back" @click="dialogoDetalle = false" class="q-mr-sm" />
                        <div class="text-h5 text-weight-bold q-mr-sm">{{ ordenSeleccionada.CodigoRadicado }}</div>
                        <q-badge color="blue-7" class="text-white">{{ columnas[4].format ?
                            columnas[4].format(ordenSeleccionada.EstadoSolicitud) : ordenSeleccionada.EstadoSolicitud
                        }}</q-badge>
                    </div>
                    <q-btn flat round dense icon="close" v-close-popup @click="VaciarObservacion" />
                </div>

                <q-card-section>
                    <!-- Información General -->
                    <q-card flat bordered class="bg-white q-pa-md radius-12 q-mb-md">
                        <div class="row items-start justify-between q-mb-sm">
                            <div class="text-subtitle1 text-weight-bold">Información General</div>
                        </div>
                        <div class="row q-col-gutter-md">
                            <div class="col-12 col-md-6">
                                <div class="info-row"><span class="info-label">Cliente</span><span class="info-value">{{
                                    InfoPqrs?.NombreCompleto || '—' }}</span></div>
                                <div class="info-row"><span class="info-label">Dirección</span><span
                                        class="info-value">{{
                                            InfoPqrs?.Direccion || '—' }}</span></div>
                                <div class="info-row"><span class="info-label">Descripción</span><span
                                        class="info-value">{{
                                            InfoPqrs?.Descripcion || '—' }}</span></div>
                            </div>
                            <div class="col-12 col-md-6">
                                <div class="info-row"><span class="info-label">Fecha de creación</span><span
                                        class="info-value">{{ Utils.formatearFecha(InfoPqrs?.FechaRadicado) }}</span>
                                </div>
                                <div class="info-row"><span class="info-label">Fecha programada</span><span
                                        class="info-value">{{ Utils.formatearFecha(InfoPqrs?.FechaEjecucion) }}</span>
                                </div>
                                <div class="info-row"><span class="info-label">Prioridad</span><q-badge color="red-5"
                                        class="q-ml-xs">Alta</q-badge></div>
                            </div>
                        </div>
                    </q-card>

                    <!-- Actividades -->
                    <div>
                        <div class="text-h6 text-weight-bold q-mb-sm">Actividades</div>
                        <q-list bordered separator class="radius-12 bg-white">
                            <q-item v-for="(actividad, index) in Actividades" :key="index" clickable
                                @click="verActividad(actividad)">
                                <q-item-section>
                                    <q-item-label class="text-weight-medium">{{ actividad.TipoOperacion
                                    }}</q-item-label>
                                    <q-item-label caption>{{ actividad.TipoTrabajo }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-icon name="chevron_right" />
                                </q-item-section>
                            </q-item>
                            <q-item v-if="!Actividades || !Actividades.length">
                                <q-item-section>
                                    <q-item-label class="text-grey">No hay actividades registradas.</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>

                    <!-- Modal Actividad -->
                    <q-dialog v-model="dialogoActividad">
                        <q-card style="width: 900px; max-width: 95vw;">
                            <div class="row items-center justify-between q-pa-md order-detail-header">
                                <div class="row items-center">
                                    <div class="actividad-titulo text-h5 text-weight-bold q-mr-sm">{{ actividadActual?.TipoTrabajo }}
                                    </div>
                                    <!-- <q-badge color="grey-2" text-color="blue-grey-9" class="actividad-badge-pill">{{ actividadActual?.TipoTrabajo
                                    }}</q-badge> -->
                                </div>
                                <q-btn flat round dense icon="close" v-close-popup />
                            </div>

                            <q-separator />

                            <q-card-section>
                                <div class="row q-col-gutter-md q-mb-md">
                                    <!-- Luminaria Vieja -->
                                    <div class="col-12 col-md-6">
                                        <q-card flat bordered>
                                            <q-card-section class="bg-grey-3">
                                                <div class="text-subtitle1 text-primary text-center">Luminaria Vieja
                                                </div>
                                            </q-card-section>
                                            <q-markup-table flat dense separator="cell">
                                                <tbody>
                                                    <tr>
                                                        <td>Código</td>
                                                        <td>{{ actividadActual?.CodigoLuminaria }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Clase</td>
                                                        <td>{{ actividadActual?.ClaseLuminaria }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tipo</td>
                                                        <td>{{ actividadActual?.TipoLuminaria }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Potencia</td>
                                                        <td>{{ actividadActual?.TipoPotencia }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Marca</td>
                                                        <td>{{ actividadActual?.MarcaLuminariaVieja }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Estado</td>
                                                        <td>{{ actividadActual?.EstadoLuminaria }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Verificación</td>
                                                        <td>{{ actividadActual?.Verificacion }}</td>
                                                    </tr>
                                                </tbody>
                                            </q-markup-table>
                                        </q-card>
                                    </div>

                                    <!-- Luminaria Nueva -->
                                    <div class="col-12 col-md-6">
                                        <q-card flat bordered>
                                            <q-card-section class="bg-grey-3">
                                                <div class="text-subtitle1 text-positive text-center">Luminaria Nueva
                                                </div>
                                            </q-card-section>
                                            <q-markup-table flat dense separator="cell">
                                                <tbody>
                                                    <tr>
                                                        <td>Código</td>
                                                        <td>{{ actividadActual?.CodigoLuminariaNueva }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Clase</td>
                                                        <td>{{ actividadActual?.ClaseLuminariaNueva }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tipo</td>
                                                        <td>{{ actividadActual?.TipoLuminariaNueva }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Potencia</td>
                                                        <td>{{ actividadActual?.TipoPotenciaNueva }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Marca</td>
                                                        <td>{{ actividadActual?.MarcaLuminariaNueva }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Estado</td>
                                                        <td>{{ actividadActual?.EstadoLuminariaNueva }}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Verificación</td>
                                                        <td>{{ actividadActual?.VerificacionNueva }}</td>
                                                    </tr>
                                                </tbody>
                                            </q-markup-table>
                                        </q-card>
                                    </div>
                                </div>
                            </q-card-section>

                            <q-separator />

                            <q-card-section>
                                <div class="q-mt-md">
                                    <q-item dense class="section-title q-pl-none">
                                        <q-item-section avatar>
                                            <q-icon name="category" color="blue-grey-7" />
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label class="text-subtitle1 text-weight-bold">Materiales
                                                Utilizados</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <q-list class="q-mt-sm">
                                        <q-item v-for="(m, mi) in actividadActual?.Materiales" :key="mi"
                                            class="material-row rounded-16 q-mb-sm">
                                            <q-item-section>
                                                <q-item-label class="text-body1">{{ m.Material }}</q-item-label>
                                                <q-item-label caption>{{ m.Tipo }}</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-chip square color="blue-grey-2" text-color="blue-grey-8">{{
                                                    m.CantidadMaterial }} {{ m.Unidad }}</q-chip>
                                            </q-item-section>
                                        </q-item>
                                        <q-item
                                            v-if="!actividadActual || !actividadActual.Materiales || !actividadActual.Materiales.length">
                                            <q-item-section>
                                                <q-item-label class="text-grey">No se registraron
                                                    materiales.</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>
                            </q-card-section>

                            <q-card-section>
                                <div class="q-pa-md evidencias-container">
                                    <q-item dense class="section-title q-pl-none q-mb-sm">
                                        <q-item-section avatar>
                                            <q-icon name="collections" color="blue-grey-7" />
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label
                                                class="text-subtitle1 text-weight-bold">Evidencias</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                    <div class="row q-col-gutter-md">
                                        <div v-for="(evidencia, ei) in actividadActual?.Evidencias" :key="ei"
                                            class="col-6 col-sm-4 col-md-3">
                                            <div class="evidence-card">

                                                <img :src="evidencia.Ruta" class="evidence-img"
                                                    @click="verEvidencia(evidencia)" />
                                                <div class="absolute-top-right q-pa-sm">
                                                    <q-btn round dense flat icon="visibility" color="white"
                                                        @click.stop="verEvidencia(evidencia)" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-dialog>

                </q-card-section>

                <!-- BOTONES DE CIERRE -->
                <q-separator />
                <div class="row q-pa-sm">
                    <div class="col-md-6 col-sm-4 col-12 q-pa-sm ">
                        <q-btn label="Aprobar Y finalizar" icon="check" color="green" outline v-close-popup
                            class="full-width bg-green-1" />
                    </div>
                    <div class="col-md-6 col-sm-4 col-12 q-pa-sm">
                        <q-btn label="devolver para correción" icon="undo" color="red" outline
                            @click="ModalObservacion = true" class="full-width bg-red-1" />
                    </div>
                    <div class="col-md-6 col-sm-4 col-12 q-pa-sm">
                        <q-btn label="Cerrar" color="grey" v-close-popup outline class="full-width bg-grey-1" />
                    </div>
                </div>


                <q-dialog v-model="ModalObservacion">
                    <q-card class="obs-card">
                        <div class="row items-center justify-between q-pa-md">
                            <div class="row items-center">
                                <q-icon name="undo" color="blue-grey-8" class="q-mr-sm" />
                                <div class="text-subtitle1 text-weight-bold">Devolver orden</div>
                            </div>
                            <q-btn flat round dense icon="close" v-close-popup @click="VaciarObservacion" />
                        </div>
                        <q-separator />
                        <q-card-section>
                            <q-input type="textarea" v-model="Observacion" autogrow outlined label="Observación..." />
                        </q-card-section>
                        <q-separator />
                        <q-card-actions align="right" class="q-pa-md">
                            <q-btn  label="Cancelar" class="bg-grey-1"  outline color="blue-grey-7" v-close-popup @click="VaciarObservacion" />
                            <q-btn label="Ejecutar devolución" icon="undo" color="red" outline class="bg-red-1" @click="EjecutarDevolucion" />
                        </q-card-actions>
                    </q-card>
                </q-dialog>

            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, Dialog } from 'quasar'
import { useRouter } from 'vue-router'
import Utils from 'src/Commons/Utils' // si tienes tu formateador de fechas
import { api } from 'src/boot/axios'
const $q = useQuasar()
const router = useRouter()
const Evidencias = ref([])
// Datos simulados (estos normalmente vienen de una API)
const ordenes = ref([])
const ModalObservacion = ref(false)
const luminariaSeleccionada = ref({})
const filtro = ref('')
const estadoFiltro = ref(null)
const dialogoDetalle = ref(false)
const ordenSeleccionada = ref({})
const Usuario = ref({})
const Actividades = ref([])
const InfoPqrs = ref({})
const Materiales = ref([])
const actividadSeleccionada = ref(null)
const Observacion = ref('')
const dialogoActividad = ref(false)
const actividadActual = ref(null)
const columnas = [
    { name: 'Codigo', label: 'Código Radicado', field: 'CodigoRadicado', align: 'center', sortable: true },
    { name: 'Tecnico', label: 'Técnico', field: 'UsuarioTecnico', align: 'center' },
    { name: 'Fecha', label: 'Fecha Creación', field: 'FechaRadicado', align: 'center', format: val => Utils.formatearFecha(val) },
    { name: 'FechaEjecucion', label: 'Fecha Ejecución', field: 'FechaEjecucion', align: 'center', format: val => Utils.formatearFecha(val) },

    {
        name: 'Estado',
        label: 'Estado',
        field: 'EstadoSolicitud',
        align: 'center',
        format: (val) => {
            switch (val) {
                case 3: return 'En validación'
                case 4: return 'Devuelto'
                default: return 'Desconocido'
            }
        }
    },
    { name: 'acciones', label: 'Acciones', align: 'center' }
]


const columnasMaterial = [
    { name: 'Codigo', label: 'Material', field: 'CodigoRadicado', align: 'center', sortable: true },
    { name: 'Tecnico', label: 'Cantidad', field: 'UsuarioTecnico', align: 'center' },
    { name: 'Fecha', label: 'Tipo Operacion', field: 'FechaRadicado', align: 'center', format: val => Utils.formatearFecha(val) },
    { name: 'FechaEjecucion', label: 'Fecha Ejecución', field: 'FechaEjecucion', align: 'center', format: val => Utils.formatearFecha(val) },


    { name: 'acciones', label: 'Acciones', align: 'center' }
]

const consultarOrdenes = async () => {

    console.log(Usuario.value)

    const response = await api.get(`/ordenservicio/${Usuario.value.IdEmpresa}/traer-ordenes-empresa`)
    ordenes.value = response.data


}

const verEvidencia = (evidencia) => {
    Dialog.create({

        message: `<img src="${evidencia.Ruta}" style="width: 90%;  border-radius: 8px;" />`,
        html: true,
        persistent: true
    })
}


const ModalObservacionConfirmar = () => {
    ModalObservacion.value = true

}


const EjecutarDevolucion = async () => {
    const Objeto =
    {
        IdPqrs: InfoPqrs.value.IdPqrs,
        IdTecnico: InfoPqrs.value.IdUsuarioTecnico,
        IdSupervisor: Usuario.value.IdUsuario,
        Observacion: Observacion.value
    }
    const response = await api.post('/ordenservicio/guardar-observacion-orden', Objeto)
    console.log(response)
    Limpiar()
    Utils.notificacion(response.data.Mensaje, response.data.IsExito)
    Utils.loadingNotify(false, '')
}


const Limpiar = () => {
    dialogoDetalle.value = false
    ModalObservacion.value = false
    Observacion.value = ''
    Actividades.value = []
    InfoPqrs.value = {}
    Materiales.value = []
    dialogoActividad.value = false
    actividadActual.value = null
}

// Filtros
const ordenesFiltradas = computed(() => {
    return ordenes.value.filter(o => {
        const coincideTexto =
            o.CodigoRadicado.toLowerCase().includes(filtro.value.toLowerCase())
        //   o.Tecnico.toLowerCase().includes(filtro.value.toLowerCase())
        const coincideEstado = !estadoFiltro.value || o.Estado === estadoFiltro.value
        return coincideTexto && coincideEstado
    })
})

// Acciones
const verDetalle = async (orden) => {
    ordenSeleccionada.value = orden
    dialogoDetalle.value = true
    const response = await api.post(`/ordenservicio/${Usuario.value.IdEmpresa}/${orden.IdPqrs}/traer-info-orden`)
    console.log(response)
    const Datos = response.data.Dato
    Actividades.value = Datos.Actividades
    InfoPqrs.value = Datos.Pqrs
    Materiales.value = Datos.Materiales
    Evidencias.value = Datos.Evidencias
    console.log(InfoPqrs.value)

}

const verActividad = (actividad) => {
    actividadActual.value = actividad
    dialogoActividad.value = true
}

const aprobarOrden = (orden) => {
    $q.dialog({
        title: 'Aprobar orden',
        message: `¿Deseas aprobar la orden ${orden.Codigo}?`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        orden.Estado = 'Aprobada'
        $q.notify({ message: 'Orden aprobada correctamente', color: 'green', icon: 'check' })
    })
}

const devolverOrden = (orden) => {
    $q.dialog({
        title: 'Devolver orden',
        message: `¿Deseas devolver la orden ${orden.Codigo} al técnico?`,
        cancel: true,
        persistent: true
    }).onOk(() => {
        orden.Estado = 'Devuelta'
        $q.notify({ message: 'Orden devuelta al técnico', color: 'red', icon: 'undo' })
    })
}


onMounted(async () => {
    try {
        const user = await Utils.datoUsuario()
        if (!user) {
            router.push('/Login')
            return
        }
        Usuario.value = user
    } catch (error) {
        console.error(error)
    }
    consultarOrdenes()
})
</script>

<style scoped>
.orders-header {
    padding: 8px 0 4px;
}

.search-input :deep(.q-field__control) {
    border-color: #e6ebf2;
}

.order-card {
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(16, 24, 40, .04);
}

.order-card:hover {
    box-shadow: 0 4px 10px rgba(16, 24, 40, .08);
}

.badge-pill {
    border-radius: 999px;
    padding: 4px 8px;
}

.actividad-titulo {
    color: #0f172a;
}

.actividad-badge-pill {
    border-radius: 999px;
    padding: 2px 10px;
    font-weight: 500;
    font-size: 12px;
    line-height: 1.3;
}

.radius-12 {
    border-radius: 12px;
}

.activity-header {
    background: #f8fafc;
    font-weight: 600;
}

.info-row {
    display: flex;
    gap: 8px;
    margin-bottom: 6px;
}

.info-label {
    width: 140px;
    color: #607d8b;
}

.info-value {
    color: #0f172a;
}

.evidencias-container .hover-card {
    width: 100%;
}

/* Modal Actividad: Materiales y Evidencias */
.section-title {
    border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.material-row {
    background: #f5f7fb;
    padding: 8px 12px;
}

.rounded-16 {
    border-radius: 16px;
}

.evidence-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
}

.evidence-img {
    display: block;
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 16px;
    cursor: zoom-in;
}
</style>
