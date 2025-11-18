<template>
    <q-page style="height: calc(100vh - 60px); overflow: auto; background-color: #EBEBF0" class="q-pa-sm">

        <!-- Header Principal -->
        <q-card flat bordered class="q-mb-md">
            <q-card-section class="bg-blue-grey-3 text-white q-pa-md">
                <div class="row items-center q-gutter-sm">
                    <q-avatar size="56px" color="white" text-color="primary">
                        <q-icon name="groups" size="32px" />
                    </q-avatar>
                    <div>
                        <div class="text-h5 text-grey-9">Gestión de Terceros y Usuarios</div>
                        <div class="text-caption text-grey-9">Administra cuentas de acceso al sistema</div>
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <div class="row q-col-gutter-md">

            <!-- Panel Izquierdo: Gestión de Terceros -->
            <div class="col-12 col-md-5">
                <q-card flat bordered>
                    <q-card-section class="bg-blue-grey-3 text-white">
                        <div class="row items-center q-gutter-sm">
                            <q-icon name="badge" color="grey-9" size="24px" />
                            <div>
                                <div class="text-subtitle2 text-grey-9">Registro de Terceros</div>
                                <div class="text-caption text-grey-9">Crear / Editar cliente o proveedor</div>
                            </div>
                        </div>
                    </q-card-section>

                    <q-separator />

                    <q-card-section class="q-pa-md">
                        <!-- <q-form @submit="" class="q-gutter-md">

              <q-input outlined dense v-model="tercero.Nombre" label="Nombre / Razón Social" />
              <q-input outlined dense v-model="tercero.Identificacion" label="Identificación / NIT" />
              <q-input outlined dense v-model="tercero.Telefono" label="Teléfono" />
              <q-input outlined dense v-model="tercero.Correo" label="Correo Electrónico" />

              <q-select outlined dense v-model="tercero.Tipo"
                        label="Tipo de tercero"
                        :options="['Cliente','Proveedor','Empleado','Otro']" />

              <div class="row justify-end q-gutter-sm q-mt-md">
                <q-btn flat label="Limpiar" color="grey-8" icon="close" @click="limpiarTercero" />
                <q-btn unelevated type="submit" label="Guardar" color="primary" icon="save"
                       :disable="!tercero.Nombre || !tercero.Identificacion" />
              </div>
            </q-form> -->
                        <FormTercero class="q-pa-md" :terceroData="terceroSeleccionado" :isDialogActivado="true"
                            @tercero-guardado="onTerceroGuardado" />
                    </q-card-section>

                    <q-separator />


                </q-card>
            </div>

            <!-- Panel Derecho: Gestión de Usuarios del Sistema -->
            <div class="col-12 col-md-7">
                <q-card flat bordered>
                    <q-card-section class="bg-blue-grey-3 text-white">
                        <div class="row items-center q-gutter-sm">
                            <q-icon name="admin_panel_settings" color="grey-9" size="24px" />
                            <div>
                                <div class="text-subtitle2 text-grey-9">Usuarios del Sistema</div>
                                <div class="text-caption text-grey-9">Asignar accesos y roles</div>
                            </div>
                        </div>
                    </q-card-section>

                    <q-separator />

                    <!-- Formulario Usuario -->
                    <q-card-section class="q-pa-md">
                        <q-form @submit="" class="q-gutter-md">

                            <q-select flat outlined ref="EmpleadoRef" clearable @clear="limpiarTercero"
                                @update:model-value="seleccionarTercero" class="col-md-6 col-sm-12 col-xs-12 col-lg-6"
                                hide-bottom-space v-model="Tercero" color="grey" option-label="NombreCompleto" use-input
                                emit-value map-options label="Tercero" :disable="CamposDisables" :options="Terceros"
                                @filter="filtrarTercero">
                                <!-- OPCIONES -->
                                <template v-slot:option="scope">
                                    <q-item v-bind="scope.itemProps">
                                        <q-item-section avatar>
                                            <q-icon name="person" />
                                        </q-item-section>

                                        <q-item-section>
                                            <q-item-label class="text-body1">
                                                {{ scope.opt?.NombreCompleto || 'Sin nombre' }}
                                            </q-item-label>
                                            <q-item-label caption>
                                                {{ scope.opt?.Identificacion || '---' }}
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>

                                <!-- SIN RESULTADOS -->
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey-10">Sin resultados</q-item-section>
                                    </q-item>
                                </template>

                                <!-- BOTÓN PARA ABRIR EL COMPONENTE DE NUEVO TERCERO -->
                                <template v-slot:after>
                                    <div class=" items-center q-pa-sm bg-grey-2 rounded-borders">
                                        <q-btn flat round dense icon="group_add" color="primary"
                                            @click="abrirFormularioTercero" :disable="CamposDisables">
                                            <q-tooltip class="bg-black" :offset="[10, 10]">
                                                Agregar Tercero
                                            </q-tooltip>
                                        </q-btn>

                                        <q-toggle :disable="CamposDisablesEdit" v-model="IsInterno" label="Interna"
                                            color="primary" size="sm" class="text-caption q-mt-xs" left-label
                                            @update:model-value="ManejarPeticionInterna">
                                            <q-tooltip class="bg-black" :offset="[10, 10]">
                                                Petición Interna
                                            </q-tooltip>

                                        </q-toggle>
                                    </div>
                                </template>

                            </q-select>

                            <q-input outlined dense v-model="usuario.NombreUsuario" label="Nombre de usuario" />
                            <q-select outlined dense v-model="usuario.IdRol" label="Rol de acceso" option-value="IdRol"
                                option-label="Nombre" :options="roles" />

                            <div class="row justify-end q-gutter-sm q-mt-md">
                                <q-btn flat label="Cancelar" color="grey-8" icon="close" @click="limpiarUsuario" />
                                <q-btn unelevated type="submit" label="Guardar Usuario" color="primary" icon="save"
                                    :disable="!usuarioSeleccionado || !usuario.NombreUsuario || !usuario.IdRol" />
                            </div>
                        </q-form>
                    </q-card-section>

                    <q-separator />

                    <!-- Tabla de Usuarios -->
                    <q-card-section>
                        <q-table :columns="colsUsuarios" :rows="usuarios" row-key="IdUsuario" flat dense>
                            <template v-slot:body-cell-acciones="props">
                                <!-- <q-btn size="sm" flat dense icon="lock_reset" color="primary" @click="resetClave(props.row)" />
                <q-btn size="sm" flat dense icon="delete" color="red" @click="desactivarUsuario(props.row)" /> -->
                            </template>
                        </q-table>
                    </q-card-section>

                </q-card>
            </div>

        </div>
    </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FormTercero from 'src/components/FormTercero.vue'
import { api } from 'src/boot/axios'
const tercero = ref({ Nombre: '', Identificacion: '', Telefono: '', Correo: '', Tipo: '' })
const terceros = ref([])
const filtroTercero = ref('')
const usuarioSeleccionado = ref(null)
const terceroSeleccionado = ref({})
const usuario = ref({ NombreUsuario: '', IdRol: null })
const usuarios = ref([])
const roles = ref([])

const tercerosFiltrados = computed(() =>
    terceros.value.filter(t =>
        t.Nombre?.toLowerCase().includes(filtroTercero.value.toLowerCase())
    )
)

const onTerceroGuardado = (res) => {
    mostrarDialogoTercero.value = false
    Utils.notificacion(res.Mensaje, res.IsExito)

}
const colsUsuarios = [
    { name: 'Nombre', label: 'Tercero', field: 'NombreTercero' },
    { name: 'Usuario', label: 'Usuario', field: 'NombreUsuario' },
    { name: 'Rol', label: 'Rol', field: 'Rol' },
    { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'right' }
]

const TraerTerceros = async () => {


    const response = api.get("terceros/traer-terceros")
}


const seleccionarTercero = (tercero) => {
    Tercero.value = tercero
}

const filtrarTercero = async (filtro, update) => {
    if (!filtro || filtro.trim() === '') return

    try {
        const response = await Utils.peticion('GET', `tercero/${Usuario.value.IdEmpresa}/empresa/${filtro}/filtro`)
        update(() => {
            Terceros.value = response.data?.Dato || []
        })
    } catch (error) {
        console.error('Error al filtrar:', error)
    }
}




onMounted(async () => {



})
</script>
