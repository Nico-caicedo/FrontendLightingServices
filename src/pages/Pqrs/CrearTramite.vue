<template>
    <q-page style="height: calc(100vh - 55px); overflow: auto; background-color: #EBEBF0">
        <EncabezadoParametros parteUno="Crear" parteDos="Tramite">
            <template #botones>
                <q-btn flat icon="description" color="grey-7" @click="AbrirFormularioPqrs" :title="'Agregar Tercero'" />
            </template>

        </EncabezadoParametros>
        <section class="row q-pa-sm">
            <main class="full-width row q-pa-md q-pt-md q-pb-md br-circle">
                <q-form ref="formRef" @submit.prevent.stop="onSubmit" @reset="onReset"
                    class="row col-12 q-col-gutter-md">

                    <q-input flat outlined v-model="Pqrs.CodigoRadicado" label="PQRS No."
                        class="col-xs-12 col-sm-3 col-md-3 col-lg-3" readonly />
                    <q-input flat outlined v-model="Pqrs.CodigoDocumento" label="Código Documento"
                        class="col-xs-12 col-sm-3 col-md-3 col-lg-3" readonly />



                    <q-input outlined v-model="Pqrs.FechaRadicado" flat type="date" readonly
                        class="col-xs-12 col-sm-6 col-md-6 col-lg-6" label="Fecha Radicado" />



                    <!-- Peticionario -->
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
                                <q-btn flat round dense icon="group_add" color="primary" @click="abrirFormularioTercero"
                                    :disable="CamposDisables">
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

                    <!-- Datos del tercero -->
                    <q-input flat outlined :disable="CamposDisables" v-model="Tercero.Identificacion"
                        class="col-xs-12 col-sm-6 col-md-6 col-lg-6" label="No. Identidad" :rules="[Utils.regla]"
                        lazy-rules />
                    <q-input flat outlined :disable="CamposDisables" v-model="Tercero.Telefono"
                        class="col-xs-12 col-sm-6 col-md-6 col-lg-6" label="Celular" />

                    <q-select flat outlined v-model="Pqrs.Sector" lazy-rules :rules="[Utils.reglaSelect]"
                        class="col-xs-12 col-sm-6 col-md-6 col-lg-6" :options="sectores" option-value="value"
                        label="Tipo Zona" emit-value map-options option-label="label" />


                    <q-input flat outlined v-model="Pqrs.MedioPeticion" :rules="[Utils.regla]" lazy-rules
                        class="col-xs-12 col-sm-6 col-md-6 col-lg-6" label="Medio de presentación" />

                    <!-- <q-select flat class="col-xs-12 col-sm-6 col-md-6 col-lg-6" lazy-rules :rules="[Utils.reglaSelect]"
                        label="Barrio o corregimiento" v-model="Pqrs.IdBarrio" :options="barrios" option-label="Nombre"
                        option-value="Id" emit-value map-options />

                    <div class="q-gutter-md row"> -->
                    <q-select flat outlined class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-model="Pqrs.IdBarrio"
                        use-input hide-selected fill-input input-debounce="300" :options="barriosFiltrados"
                        option-label="NombreBarrio" option-value="IdBarrio" emit-value map-options label="Barrio o corregimiento"
                        @filter="filtrarBarrios" lazy-rules :rules="[Utils.reglaSelect]">

                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                    <!-- </div> -->

                    <q-input flat outlined v-model="Pqrs.Direccion" :rules="[Utils.regla]" lazy-rules
                        class="col-xs-12 col-sm-6 col-md-6 col-lg-6" label="Dirección " />
                    <q-input flat outlined :disable="CamposDisables" :rules="[Utils.regla]" lazy-rules
                        v-model="Tercero.Correo" class="col-xs-12 col-sm-6 col-md-6 col-lg-6" label="Correo" />


                    <q-input flat outlined v-model="Pqrs.TipoDano" lazy-rules
                        class="col-xs-12 col-sm-6 col-md-12 col-lg" label="Tipo de daño de alumbrado público"
                        :rules="[Utils.regla]" />

                    <q-input v-model="Pqrs.Observacion" flat outlined type="textarea" :rules="[Utils.regla]" lazy-rules
                        label="Observación Usuario" class="col-12" />
                    <!-- 
                    <q-checkbox :disable="CamposDisables" v-model="Acepta" class="col-xs-12 col-sm-12 col-md col-lg"
                        label="Autoriza notificación electrónica" /> -->

                    <div class="col-xs-12 q-mt-md">
                        <q-btn v-if="!IsEdit" label="Generar orden" type="submit" color="black" class="q-mr-sm" />
                        <q-btn v-else label="Guardar Cambios" type="submit" color="black" class="q-mr-sm" />
                        <q-btn label="Cancelar" type="reset" color="grey" />
                    </div>

                </q-form>

                <q-dialog v-model="mostrarDialogoTercero">
                    <q-card style="width: 800px; max-width: 90vw;">
                        <q-toolbar class="bg-blue-grey-9 text-white">
                            <q-toolbar-title>
                                Agregar Tercero
                            </q-toolbar-title>
                            <q-btn flat icon="close" v-close-popup>
                                <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
                            </q-btn>
                        </q-toolbar>
                        <q-card-section class="q-pa-md">
                            <FormTercero class="q-pa-md" :terceroData="terceroSeleccionado" :isDialogActivado="true"
                                @tercero-guardado="onTerceroGuardado" />
                        </q-card-section>


                    </q-card>

                </q-dialog>

                <q-dialog v-model="mostrarDialogoPqrs" maximized full-width>
                    <q-card style="width: 800px; max-width: 90vw;">
                        <q-toolbar class="bg-blue-grey-9 text-white">
                            <q-toolbar-title>
                                Pqrs
                            </q-toolbar-title>
                            <q-btn flat icon="close" v-close-popup>
                                <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
                            </q-btn>
                        </q-toolbar>
                        <q-card-section class="q-pa-md">
                            <Tramites class="q-pa-md" :terceroData="terceroSeleccionado" :isDialogActivado="true"
                                @editar-pqrs="PqrsEdit" />
                        </q-card-section>


                    </q-card>

                </q-dialog>
            </main>
        </section>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LocalStorage } from 'quasar'
import { api } from 'src/boot/axios'
import Utils from 'src/Commons/Utils'
import EncabezadoParametros from 'src/components/EncabezadoParametros.vue'
import FormTercero from 'src/components/FormTercero.vue'
import Tramites from 'src/components/Tramites.vue'
const route = useRoute()
const router = useRouter()
const Usuario = ref({})
const Pqrs = ref({})
const Tercero = ref('')
const terceroSeleccionado = ref({})
const mostrarDialogoTercero = ref(false)
const mostrarDialogoPqrs = ref(false)
const Terceros = ref([])
const Sector = ref('')
const FechaRadicado = ref('')
const FechaMaxima = ref('')
const TerceroEmpresa = ref('')
const Acepta = ref(false)
const CamposDisables = ref(false)
const CamposDisablesEdit = ref(false)
const IsEdit = ref(false)
const formRef = ref(null)
const sectores = ref([
    {
        label: 'Urbano',
        value: 'Urbano'
    }, {
        label: 'Rural',
        value: 'Rural'
    }])

const IsInterno = ref(false)


const barrios = ref([])

const barriosFiltrados = ref([...barrios.value])


const filtrarBarrios = (val, update) => {
    if (val === '') {
        update(() => {
            barriosFiltrados.value = [...barrios.value]
        })
        return
    }

    update(() => {
        const needle = val.toLowerCase()
        barriosFiltrados.value = barrios.value.filter(b =>
            b.NombreBarrio.toLowerCase().includes(needle)
        )
    })
}

const cargarBarrios = async () => {
  try {
    Utils.loadingNotify(true, 'Cargando barrios...')
    const response = await api.get(`/ordenservicio/traer-barrios`)
   
      barrios.value = response.data
      barriosFiltrados.value = [...barrios.value]
 
  } catch (error) {
    console.error('Error al cargar barrios:', error)
    Utils.notificacion('Error al cargar los barrios', false)
  } finally {
    Utils.loadingNotify(false)
  }
}


const onReset = () => {
    Pqrs.value = {}
    Tercero.value = ''
    Acepta.value = false
    IsEdit.value = false
    CamposDisablesEdit.value = false
    CamposDisables.value = false
    IsInterno.value = false
    Pqrs.value.FechaRadicado = Utils.fechaHoy()

}
const abrirFormularioTercero = () => {
    terceroSeleccionado.value = {}
    mostrarDialogoTercero.value = true
}

const onTerceroGuardado = (res) => {
    mostrarDialogoTercero.value = false
    Utils.notificacion(res.Mensaje, res.IsExito)

}

const PqrsEdit = (orden) => {
    IsEdit.value = true
    mostrarDialogoPqrs.value = false
    console.log('Antes:', orden)
    IsInterno.value = false
    CamposDisables.value = false


    const ordencopia = { ...orden }
    console.log('COPIA:', ordencopia)

    // Realiza tus acciones sobre la copia
    seleccionarPorTercero(ordencopia.Identificacion)
    ordencopia.FechaRadicado = Utils.darFormatoDate(ordencopia.FechaRadicado)

    console.log('Después:', ordencopia)
    if (ordencopia.IsInterno) {
        IsInterno.value = ordencopia.IsInterno
        CamposDisables.value = true
    }
    // Asignar la copia al objeto reactivo

    Pqrs.value = ordencopia
    // Pqrs.value.Sector = ordencopia.Sector

}


const TraerOrdenId = async (idpqrs) => {
    Utils.loadingNotify(true, 'Obteniendo orden...')
    const response = await api.post(`/ordenservicio/${idpqrs}/traer-orden-idpqrs`)
    console.log(response)
    Utils.notificacion(response.data.Mensaje, response.data.IsExito)
}


const AbrirFormularioPqrs = () => {
    mostrarDialogoPqrs.value = true
}

const onSubmit = async () => {
    if (!formRef.value) return

    const valid = await formRef.value.validate()

    if (valid && !IsEdit.value) {
        CrearTramite()
    } else if (valid && IsEdit.value) {
        GuardarCambiosOrden()
    }
}

const limpiarTercero = () => {
    Tercero.value = ''
}

const seleccionarTercero = (tercero) => {
    Tercero.value = tercero
}

const ManejarPeticionInterna = () => {


    if (IsInterno.value) {
        // Si es interna, limpia y desactiva el campo tercero
        Tercero.value = ''
        CamposDisables.value = true
        Tercero.value = TerceroEmpresa.value
        // Acepta.value = false
    } else {
        // Si NO es interna, habilita nuevamente el campo tercero
        CamposDisables.value = false
        Tercero.value = ''
    }
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



const seleccionarPorTercero = async (identificacion) => {
    // Buscar el tercero correspondiente en la lista
    const response = await Utils.peticion('GET', `tercero/${Usuario.value.IdEmpresa}/empresa/${identificacion}/filtro`)
    Terceros.value = response.data?.Dato
    const encontrado = Terceros.value.find(t => t.Identificacion == identificacion)
    if (encontrado) {

        seleccionarTercero(Terceros.value[0])
    } else {
        console.log('no se encontro')
    }
}



const CrearTramite = async () => {
    try {
        // Pqrs.value.AutorizaNotificacion = Acepta.value
        // Pqrs.value.Sector = Sector.value

        Pqrs.value.CodigoDocumento = ""
        Pqrs.value.CodigoRadicado = ""
        Pqrs.value.IdUsuarioC = Usuario.value.IdUsuario
        Pqrs.value.IdEmpresa = Usuario.value.IdEmpresa
        Pqrs.value.IsInterno = IsInterno.value
        Pqrs.value.IdTercero = Tercero.value.IdTercero
        console.log(Pqrs.value)
        Utils.loadingNotify(true, 'Generando orden...')
        const response = await api.post('/ordenservicio/crear-orden-servicio', Pqrs.value)
        console.log(response)
        Utils.notificacion(response.data.Mensaje, response.data.IsExito)
        onReset()
    } catch (error) {
        Utils.notificacion('Error en la conexión', false)
    } finally {
        Utils.loadingNotify(false)
    }
}


const GuardarCambiosOrden = async () => {
    Pqrs.value.IdUsuarioA = Usuario.value.IdUsuario


    Pqrs.value.IdTercero = Tercero.value.IdTercero

    Utils.loadingNotify(true, 'Guardando Cambios...')
    const response = await api.post('/ordenservicio/guardar-cambios-orden', Pqrs.value)
    console.log(response)
    Utils.loadingNotify(false, '')
    Utils.notificacion(response.data.Mensaje, response.data.IsExito)

}

const TraerTerceroEmpresa = async () => {

    const response = await api.post(`/tercero/${Usuario.value.IdEmpresa}/traer-tercero-empresa`, Pqrs.value)
    TerceroEmpresa.value = response.data
}


const LimpiarCampos = () => {
    Pqrs.value = {}
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
    TraerTerceroEmpresa()
    await cargarBarrios()
    Pqrs.value.FechaRadicado = Utils.fechaHoy()

})
</script>
