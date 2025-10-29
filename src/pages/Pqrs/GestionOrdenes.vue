<template>
    <q-page class="q-pa-md bg-grey-2">
        <div class="text-h5 text-primary q-mb-md">
            Gestión de Órdenes de Servicio
        </div>

        <!-- Filtro y búsqueda -->
        <div class="bg-white row full q-gutter-sm q-pa-sm q-ma-sm">
            <q-input v-model="filtro" label="Buscar por código o técnico" dense clearable outlined />
            <q-select v-model="estadoFiltro" :options="['Pendiente', 'En validación', 'Aprobada', 'Devuelta']"
                label="Filtrar por estado" dense clearable outlined />
        </div>

        <!-- Tabla de órdenes -->
        <q-table title="Órdenes registradas" :rows="ordenesFiltradas" :columns="columnas" row-key="IdOrden" flat
            bordered dense>
            <template v-slot:body-cell-acciones="props">
                <q-td align="center">
                    <q-btn flat round dense icon="view_headline">
                        <q-menu>
                            <q-list style="min-width: 100px">
                                <q-item clickable v-close-popup @click="verDetalle(props.row)">
                                    <q-item-section>Ver Orden</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="aprobarOrden(props.row)">
                                    <q-item-section>Aprobar Orden</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="devolverOrden(props.row)">
                                    <q-item-section>Devolver Orden</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>

                </q-td>
            </template>
        </q-table>

        <!-- Diálogo de detalle -->
        <q-dialog v-model="dialogoDetalle" maximized full-width>
            <q-card style="min-width: 400px">
                <!-- CABECERA -->
                <q-toolbar class="bg-blue-grey-9 text-white">
                    <q-toolbar-title>Detalles de la Orden</q-toolbar-title>
                    <q-btn flat round dense icon="close" v-close-popup @click="VaciarObservacion" />
                </q-toolbar>

                <q-card-section>
                    <!-- INFORMACIÓN GENERAL -->
                    <div class="q-pa-sm bg-grey-2 rounded-borders q-mb-md">
                        <div class="text-h6 text-primary q-mb-sm">Información del PQRS</div>
                        <div class="row q-col-gutter-md">
                            <div class="col-12 col-md-6">
                                <p><b>Código Radicado:</b> {{ InfoPqrs?.CodigoRadicado }}</p>
                                <p><b>Código Documento:</b> {{ InfoPqrs?.CodigoDocumento }}</p>
                                <p><b>Barrio:</b> {{ InfoPqrs?.NombreBarrio }}</p>
                            </div>
                            <div class="col-12 col-md-6">
                                <p><b>Nombre:</b> {{ InfoPqrs?.NombreCompleto }}</p>
                                <p><b>Dirección:</b> {{ InfoPqrs?.Direccion }}</p>
                                <p><b>Correo:</b> {{ InfoPqrs?.Correo }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- LUMINARIA VIEJA Y NUEVA -->
                    <div class="q-pa-md">
                        <div class="text-h6 text-primary q-mb-md">Lista de Actividades</div>

                        <!-- Lista interactiva de actividades -->
                        <q-list bordered separator>
                            <q-expansion-item v-for="(actividad, index) in Actividades" :key="index" expand-separator
                                icon="engineering" :label="actividad.TipoOperacion"
                                :caption="`Tipo Trabajo: ${actividad.TipoTrabajo} | Vieja: ${actividad.CodigoLuminariaVieja}  |  Nueva: ${actividad.CodigoLuminariaNueva}`"
                                header-class="bg-grey-2 text-primary text-bold">
                                <q-card flat bordered class="q-mt-sm q-pa-sm bg-grey-1">
                                    <q-card-section>
                                        <div class="row q-col-gutter-md q-mb-md">
                                            <!-- Luminaria Vieja -->
                                            <div class="col-12 col-md-6">
                                                <q-card flat bordered>
                                                    <q-card-section class="bg-grey-3">
                                                        <div class="text-subtitle1 text-primary text-center">
                                                            Luminaria Vieja
                                                        </div>
                                                    </q-card-section>
                                                    <q-markup-table flat dense separator="cell">
                                                        <tbody>
                                                            <tr>
                                                                <td>Código</td>
                                                                <td>{{ actividad.CodigoLuminariaVieja }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Clase</td>
                                                                <td>{{ actividad.ClaseLuminariaVieja }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Tipo</td>
                                                                <td>{{ actividad.TipoLuminariaVieja }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Potencia</td>
                                                                <td>{{ actividad.TipoPotenciaVieja }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Marca</td>
                                                                <td>{{ actividad.MarcaLuminariaVieja }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Estado</td>
                                                                <td>{{ actividad.EstadoLuminariaVieja }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Verificación</td>
                                                                <td>{{ actividad.VerificacionVieja }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </q-markup-table>
                                                </q-card>
                                            </div>

                                            <!-- Luminaria Nueva -->
                                            <div class="col-12 col-md-6">
                                                <q-card flat bordered>
                                                    <q-card-section class="bg-grey-3">
                                                        <div class="text-subtitle1 text-positive text-center">
                                                            Luminaria Nueva
                                                        </div>
                                                    </q-card-section>
                                                    <q-markup-table flat dense separator="cell">
                                                        <tbody>
                                                            <tr>
                                                                <td>Código</td>
                                                                <td>{{ actividad.CodigoLuminariaNueva }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Clase</td>
                                                                <td>{{ actividad.ClaseLuminariaNueva }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Tipo</td>
                                                                <td>{{ actividad.TipoLuminariaNueva }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Potencia</td>
                                                                <td>{{ actividad.TipoPotenciaNueva }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Marca</td>
                                                                <td>{{ actividad.MarcaLuminariaNueva }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Estado</td>
                                                                <td>{{ actividad.EstadoLuminariaNueva }}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Verificación</td>
                                                                <td>{{ actividad.VerificacionNueva }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </q-markup-table>
                                                </q-card>
                                            </div>
                                        </div>
                                    </q-card-section>
                                    <q-card-section>
                                        <div class="q-mt-md">
                                            <div class="text-h6 text-primary q-mb-sm col-8 col-sm-3 col-md-4 col-lg-3">
                                                Materiales Utilizados
                                            </div>
                                            <q-list bordered separator class="rounded-borders bg-grey-1">
                                                <q-item v-for="(m, index) in actividad.Materiales" :key="index">
                                                    <q-item-section>
                                                        <q-item-label><b>{{ m.Material }}</b></q-item-label>
                                                        <q-item-label caption>
                                                            Cantidad: {{ m.CantidadMaterial }} {{ m.Unidad }} — {{
                                                                m.Tipo }}
                                                        </q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item v-if="!actividad.Materiales || !actividad.Materiales.length">
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
                                            <!-- Título -->
                                            <div class="text-h6 text-weight-bold text-primary q-mb-lg text-center">
                                                Lista de Evidencias
                                            </div>

                                            <!-- Contenedor de tarjetas responsive -->
                                            <div class="row q-col-gutter-md justify-center">
                                                <div v-for="(evidencia, index) in actividad.Evidencias" :key="index"
                                                    class="col-10 col-sm-3 col-md-3 col-lg-3">
                                                    <q-card flat bordered
                                                        class="hover-card column items-center q-pa-sm">
                                                        <!-- Imagen de evidencia -->
                                                        <q-img :src="evidencia.Ruta" ratio="1" spinner-color="primary"
                                                            class="rounded-borders shadow-1">
                                                            <div
                                                                class="absolute-bottom bg-black bg-opacity-40 text-white text-center q-pa-xs text-caption truncate">
                                                                {{ evidencia.Nombre || `Evidencia ${index + 1}` }}
                                                            </div>
                                                        </q-img>

                                                        <!-- Botón de acción -->
                                                        <q-card-actions align="center" class="q-mt-xs">
                                                            <q-btn flat color="primary" icon="visibility" label="Ver"
                                                                class="btn-ver" @click="verEvidencia(evidencia)" />
                                                        </q-card-actions>
                                                    </q-card>
                                                </div>
                                            </div>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </q-expansion-item>
                        </q-list>
                    </div>

                    <!-- LISTA DE MATERIALES -->
                    <div class="q-mt-md">
                        <div class="text-h6 text-primary q-mb-sm col-8 col-sm-3 col-md-4 col-lg-3">Materiales Utilizados
                        </div>
                        <q-list bordered separator class="rounded-borders bg-grey-1">
                            <q-item v-for="(m, index) in Materiales" :key="index">
                                <q-item-section>
                                    <q-item-label><b>{{ m.Material }}</b></q-item-label>
                                    <q-item-label caption>
                                        Cantidad: {{ m.CantidadMaterial }} {{ m.Unidad }} — {{ m.Tipo }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item v-if="!Materiales || !Materiales.length">
                                <q-item-section>
                                    <q-item-label class="text-grey">No se registraron materiales.</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <div class="q-pa-md evidencias-container">
                        <!-- Título -->
                        <div class="text-h6 text-weight-bold text-primary q-mb-lg text-center">
                            Lista de Evidencias
                        </div>

                        <!-- Contenedor de tarjetas responsive -->
                        <div class="row q-col-gutter-md justify-center">
                            <div v-for="(evidencia, index) in Evidencias" :key="index"
                                class="col-10 col-sm-3 col-md-3 col-lg-3">
                                <q-card flat bordered class="hover-card column items-center q-pa-sm">
                                    <!-- Imagen de evidencia -->
                                    <q-img :src="evidencia.Ruta" ratio="1" spinner-color="primary"
                                        class="rounded-borders shadow-1">
                                        <div
                                            class="absolute-bottom bg-black bg-opacity-40 text-white text-center q-pa-xs text-caption truncate">
                                            {{ evidencia.Nombre || `Evidencia ${index + 1}` }}
                                        </div>
                                    </q-img>

                                    <!-- Botón de acción -->
                                    <q-card-actions align="center" class="q-mt-xs">
                                        <q-btn flat color="primary" icon="visibility" label="Ver" class="btn-ver"
                                            @click="verEvidencia(evidencia)" />
                                    </q-card-actions>
                                </q-card>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <!-- BOTONES DE CIERRE -->
                <q-separator />
                <q-card-actions class="q-gutter-sm" align="right">
                    <q-btn label="Aprobar Y finalizar" icon="check" color="green" v-close-popup />
                    <q-btn label="devolver para correción" icon="undo" color="red" @click="ModalObservacion = true" />
                    <q-btn label="Cerrar" color="grey" v-close-popup />
                </q-card-actions>

                <q-dialog v-model="ModalObservacion" style="min-width: 400px">
                    <q-card style="min-width: 400px">
                        <q-toolbar class="bg-blue-grey-9 text-white">
                            <q-toolbar-title>Observacion devolución orden</q-toolbar-title>
                            <q-btn flat round dense icon="close" v-close-popup @click="VaciarObservacion" />
                        </q-toolbar>
                        <q-card-section leave-class="">
                            <div class="q-gutter-y-sm">
                                <q-input type="textarea" label="Observación Orden..." v-model="Observacion" />
                                <div align="center">
                                    <q-btn label="Ejecutar devolución" icon="undo" color="green"
                                        @click="EjecutarDevolucion" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-dialog>

            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, Dialog } from 'quasar'
import Utils from 'src/Commons/Utils' // si tienes tu formateador de fechas
import { api } from 'src/boot/axios'
const $q = useQuasar()
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
const Actividades = ref({})
const InfoPqrs = ref({})
const Materiales = ref([])
const actividadSeleccionada = ref(null)
const Observacion = ref('')
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
    Actividades.value = {}
    InfoPqrs.value = {}
    Materiales.value = []
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
    InfoPqrs.value = Datos.InfoPqrs
    Materiales.value = Datos.Materiales
    Evidencias.value = Datos.Evidencias

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
