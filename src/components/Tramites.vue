<template>

    <div class="q-gutter-md">

        <!-- Título -->
        <div class="text-h5 text-black text-weight-bold q-mb-md flex items-center justify-between">
            <div>
                <q-icon name="assignment" class="q-mr-sm" /> Gestor de PQRS / Órdenes
            </div>
            <q-btn color="black" label="Actualizar" icon="refresh" @click="cargarPqrs" />
        </div>

        <!-- Filtro de búsqueda -->
        <q-input dense outlined debounce="300" v-model="filtro" placeholder="Buscar por número, técnico o estado..."
            clearable prepend-inner-icon="search" class="bg-white" />

        <!-- Tabla de PQRS -->
        <q-table :rows="filtradas" :columns="columnas" row-key="IdPqrs" flat bordered dense :loading="cargando"
            no-data-label="No hay registros disponibles" separator="cell">
            <template v-slot:body-cell-acciones="props">
                <q-td align="center">
                    <q-btn flat round dense icon="view_headline">
                        <q-menu>
                            <q-list style="min-width: 150px" separator>

                                <!-- Editar -->
                                <q-item clickable v-close-popup @click="editarPqrs(props.row)">

                                    <q-item-section>
                                        <q-item-label>Editar</q-item-label>
                                    </q-item-section>
                                </q-item>

                                <!-- Eliminar -->
                                <q-item clickable v-close-popup @click="confirmarEliminacion(props.row)">

                                    <q-item-section>
                                        <q-item-label>Eliminar</q-item-label>
                                    </q-item-section>
                                </q-item>

                            </q-list>
                        </q-menu>

                    </q-btn>
                    <!-- <q-btn flat color="black" icon="edit" round dense @click="editarPqrs(props.row)">
                        <q-tooltip>Editar PQRS</q-tooltip>
                    </q-btn>

                    <q-btn flat color="black" icon="delete" round dense @click="confirmarEliminacion(props.row)">
                        <q-tooltip>Eliminar PQRS</q-tooltip>
                    </q-btn> -->
                </q-td>
            </template>
        </q-table>

        <!-- Diálogo de confirmación -->
        <q-dialog v-model="dialogEliminar">
            <q-card class="q-pa-md">
                <q-card-section>
                    <div class="text-h6">Confirmar eliminación</div>
                    <div>¿Deseas eliminar esta PQRS: <b>{{ pqrsSeleccionada?.Numero }}</b>?</div>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="grey" v-close-popup />
                    <q-btn flat label="Eliminar" color="negative" @click="eliminarPqrsConfirmada" />
                </q-card-actions>
            </q-card>
        </q-dialog>

    </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { Notify } from 'quasar'
import Utils from 'src/Commons/Utils'
import { useRouter, useRoute } from 'vue-router'
// Estado
const pqrs = ref([])
const cargando = ref(false)
const filtro = ref('')
const dialogEliminar = ref(false)
const pqrsSeleccionada = ref(null)
const Usuario = ref({})
// Columnas
const columnas = [
    { name: 'Numero', label: 'Número PQRS', field: 'CodigoRadicado', align: 'center', sortable: true },
    { name: 'CodigoDocumento', label: 'Código Documento', field: 'CodigoDocumento', align: 'center', sortable: true },
    { name: 'Fecha', label: 'Fecha', field: 'FechaRadicado', align: 'center', sortable: true, format: (val) => Utils.formatearFecha(val) },
    { name: 'Tercero', label: 'Creador Orden', field: 'CreadorOrden', align: 'center' },
    {
        name: 'Estado', label: 'Estado', field: 'EstadoSolicitud', align: 'center', format: (val) => {
            switch (val) {
                case 1:
                    return 'Sin Asignar'
                case 2:
                    return 'Por Validar'
                case 3:
                    return 'Asignado'
                case 4:
                    return 'Terminado'
                default:
                    return 'Desconocido'
            }
        }
    },
    { name: 'acciones', label: 'Acciones', align: 'center' }
]

// Filtrado
const filtradas = computed(() => {
    if (!filtro.value) return pqrs.value
    const term = filtro.value.toLowerCase()
    return pqrs.value.filter(p =>
        (p.CodigoRadicado?.toLowerCase().includes(term)) ||
        (p.CreadorOrden?.toLowerCase().includes(term))
    )
})

// Cargar datos
const cargarPqrs = async () => {
    cargando.value = true
    try {
        const response = await api.get(`ordenservicio/${Usuario.value.IdEmpresa}/traer-todo-ordenes-empresa`)
        pqrs.value = response.data
    } catch (error) {
        Notify.create({ message: 'Error al cargar PQRS', color: 'negative', icon: 'error' })
    } finally {
        cargando.value = false
    }
}



// Editar PQRS
const emit = defineEmits(['editar-pqrs'])

const editarPqrs = (item) => {
    pqrsSeleccionada.value = item
    emit('editar-pqrs', item) // Enviamos los datos al formulario principal
    Notify.create({
        message: `PQRS ${item.CodigoRadicado} cargada para edición`,
        color: 'green',
        icon: 'edit'
    })
}

// Eliminar PQRS
const confirmarEliminacion = (item) => {
    pqrsSeleccionada.value = item
    dialogEliminar.value = true
}

const eliminarPqrsConfirmada = async () => {
    try {
        await api.delete(`/pqrs/eliminar/${pqrsSeleccionada.value.IdPqrs}`)
        Notify.create({ message: 'PQRS eliminada correctamente', color: 'positive', icon: 'check' })
        pqrs.value = pqrs.value.filter(p => p.IdPqrs !== pqrsSeleccionada.value.IdPqrs)
    } catch (error) {
        Notify.create({ message: 'Error al eliminar PQRS', color: 'negative', icon: 'error' })
    } finally {
        dialogEliminar.value = false
    }
}

const TraerDatosTerceroEmpresa = async () => {

}




onMounted(async () => {


    try {
        const user = await Utils.datoUsuario()
        if (!user) {
            router.push('/Login')
            return
        }
        Usuario.value = user
        cargarPqrs()
    } catch (error) {
        console.error(error)
    }


})

</script>

<style scoped>
.q-page {
    min-height: calc(100vh - 50px);
}
</style>
