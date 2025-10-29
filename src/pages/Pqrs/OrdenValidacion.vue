<template>
    <q-page class="q-pa-md bg-grey-1">

        <q-card flat bordered class="q-pa-md shadow-2">
            <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Órdenes en Fase de Validación</div>
                <q-input dense debounce="300" v-model="filtro" placeholder="Buscar orden..." filled clearable>
                    <template #append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </div>

            <q-table :rows="filtradas" :columns="columnas" row-key="IdOrden" :loading="cargando"
                no-data-label="No hay órdenes para validar" flat bordered>
                <template #body-cell-acciones="props">
                    <q-td align="center">
                        <!-- Supervisor: Asignar técnico -->
                        <div v-if="Usuario.IdRol == 1">
                            <q-btn color="black" label="Asignar Técnico" icon="person_add" size="sm"
                                @click="abrirAsignacion(props.row)" />
                        </div>

                        <!-- Técnico: Validar orden -->
                        <div v-else-if="Usuario.IdRol == 2 && props.row.NombreTecnico == Usuario.NombreCompleto">
                            <q-btn color="black" label="Validar" icon="build" size="sm"
                                @click="abrirValidacion(props.row)" />
                        </div>

                        <!-- Si no aplica -->
                        <div v-else>-</div>
                    </q-td>
                </template>
            </q-table>
        </q-card>

        <!-- Diálogo para asignar técnico -->
        <q-dialog v-model="dialogAsignar">
            <q-card style="min-width: 400px">
                <q-card-section class="text-h6">Asignar Técnico</q-card-section>
                <q-card-section>
                    <q-select v-model="tecnicoSeleccionado" :options="tecnicos" option-label="NombreCompleto"
                        option-value="IdUsuario" label="Seleccione un técnico" filled clearable />
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="grey" v-close-popup />
                    <q-btn label="Asignar" color="primary" @click="asignarTecnico" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Diálogo de Validación Técnica -->
        <q-dialog maximized full-width v-model="dialogValidacion" persistent>

            <q-card style="min-width: 600px; max-width: 90vw">
                <q-toolbar class="bg-blue-grey-9 text-white">
                    <q-toolbar-title>
                        Validar Orden - {{ ordenSeleccionada?.CodigoRadicado }}
                    </q-toolbar-title>
                    <q-btn flat icon="close" v-close-popup>
                        <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
                    </q-btn>
                </q-toolbar>


                <q-card-section>
                    <div class="row q-col-gutter-md">
                        <div class="text-body2 q-mb-md">
                            
                            <strong>Barrio:</strong> {{ ordenSeleccionada.Barrio || 'Sin información' }}
                             <strong>Direccion:</strong> {{ ordenSeleccionada.Direccion || 'Sin información' }}
                            <strong>Observacion:</strong> {{ ordenSeleccionada.Observacion || 'No especificada' }}<br />
                            
                        </div>

                        <div class="col-12">
                            <!-- <q-input v-model="validacion.Observaciones" label="Observaciones del sitio" type="textarea"
                                filled /> -->
                        </div>

                        <div class="col-6">
                            <q-input v-model="validacion.Latitud" label="Latitud" filled />
                        </div>
                        <div class="col-6">
                            <q-input v-model="validacion.Longitud" label="Longitud" filled />
                        </div>

                        <div class="col-12">
                            <q-file v-model="validacion.Fotos" label="Subir fotos del sitio" filled multiple
                                accept="image/*" use-chips>
                                <template #append>
                                    <q-icon name="photo_camera" />
                                </template>
                            </q-file>
                        </div>

                        <div class="col-12">
                            <q-select v-model="validacion.Resultado" :options="[
                                { label: 'Sitio verificado y correcto', value: 'Aprobado' },
                                { label: 'Se requiere ajuste o corrección', value: 'Rechazado' }
                            ]" label="Resultado de validación" filled />
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="grey" v-close-popup />
                    <q-btn label="Guardar Validación" color="positive" @click="guardarValidacion" />
                </q-card-actions>
            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import Utils from 'src/Commons/Utils'

const cargando = ref(false)
const filtro = ref('')
const ordenes = ref([])
const Usuario = ref({})
const tecnicos = ref([])
const dialogAsignar = ref(false)
const tecnicoSeleccionado = ref(null)
const ordenSeleccionada = ref(null)
const dialogValidacion = ref(false)

const validacion = ref({
    Observaciones: '',
    Latitud: '',
    Longitud: '',
    Fotos: [],
    Resultado: ''
})

const columnas = [
    { name: 'Codigo', label: 'Código', field: 'CodigoRadicado', align: 'center', sortable: true },
    { name: 'Fecha', label: 'Fecha', field: 'FechaRadicado', align: 'center', format: val => Utils.formatearFecha(val) },
    { name: 'Creador', label: 'Creador', field: 'CreadorOrden', align: 'center' },
    { name: 'Barrio', label: 'Barrio', field: 'Barrio', align: 'center' },
    { name: 'NombreTecnico', label: 'Asignado a', field: 'NombreTecnico', align: 'center' },
    { name: 'acciones', label: 'Acciones', align: 'center' }
]

const filtradas = computed(() => {
    if (!filtro.value) return ordenes.value
    const term = filtro.value.toLowerCase()
    return ordenes.value.filter(o =>
        o.CodigoRadicado?.toLowerCase().includes(term) ||
        o.Barrio?.toLowerCase().includes(term) ||
        o.AsignadoA?.toLowerCase().includes(term)
    )
})

const cargarOrdenes = async () => {
    cargando.value = true
    try {
        const response = await api.get(`/ordenservicio/${Usuario.value.IdEmpresa}/2/traer-ordenes-empresa-visita`)
        ordenes.value = response.data
    } catch (error) {
        Notify.create({ message: 'Error al cargar órdenes', color: 'negative', icon: 'error' })
    } finally {
        cargando.value = false
    }
}

const cargarTecnicos = async () => {
    try {
        const response = await api.get(`usuario/2/${Usuario.value.IdEmpresa}/usuario-por-cargo`)
        tecnicos.value = response.data
    } catch {
        Notify.create({ message: 'Error al cargar técnicos', color: 'negative', icon: 'error' })
    }
}

const abrirAsignacion = (orden) => {
    console.log(orden)
    ordenSeleccionada.value = orden
    dialogAsignar.value = true
}

const asignarTecnico = async () => {
    try {
        const asignacion = {
            IdPqrs: ordenSeleccionada.value.IdPqrs,
            IdUsuario: tecnicoSeleccionado.value.IdUsuario,
            IdUsuarioA: Usuario.value.IdUsuario
        }
        await api.post('ordenservicio/asignar-tecnicos-orden-visita', asignacion)
        Notify.create({ message: 'Técnico asignado correctamente', color: 'positive', icon: 'check' })
        dialogAsignar.value = false
        cargarOrdenes()
    } catch {
        Notify.create({ message: 'Error al asignar técnico', color: 'negative', icon: 'error' })
    }
}

const abrirValidacion = (orden) => {
    ordenSeleccionada.value = orden
    dialogValidacion.value = true
}

const guardarValidacion = async () => {
    if (!validacion.value.Resultado) {
        Notify.create({ message: 'Debe seleccionar el resultado de la validación', color: 'warning', icon: 'warning' })
        return
    }

    const formData = new FormData()
    formData.append('IdOrden', ordenSeleccionada.value.IdOrden)
    formData.append('Observaciones', validacion.value.Observaciones)
    formData.append('Latitud', validacion.value.Latitud)
    formData.append('Longitud', validacion.value.Longitud)
    formData.append('Resultado', validacion.value.Resultado)

    for (let foto of validacion.value.Fotos) {
        formData.append('Fotos', foto)
    }

    try {
        await api.post('/ordenservicio/guardar-validacion', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        Notify.create({ message: 'Validación guardada correctamente', color: 'positive', icon: 'check' })
        dialogValidacion.value = false
        cargarOrdenes()
    } catch (error) {
        Notify.create({ message: 'Error al guardar validación', color: 'negative', icon: 'error' })
    }
}

onMounted(async () => {
    const user = await Utils.datoUsuario()
    Usuario.value = user
    await cargarOrdenes()
    if (user.IdRol == 1) await cargarTecnicos()
})
</script>
