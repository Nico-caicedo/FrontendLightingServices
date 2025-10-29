<template>
  <q-page style="height: calc(100vh - 55px); overflow: auto; background-color: #EBEBF0">
    <EncabezadoParametros parteUno="Gestión" parteDos="Órdenes">
      <template #botones>
        <!-- <q-btn color="primary" label="Asignar seleccionadas" :disable="ordenes.length === 0" @click="assignment = true"
          icon="assignment" class="q-ml-sm" /> -->
      </template>
    </EncabezadoParametros>

    <section class="row q-pa-sm">
      <main class="full-width row q-pa-md q-pt-md q-pb-md br-circle">
        <q-card class="full-width">
          <q-tabs v-model="tab" dense class="bg-grey-4 text-white-7" active-color="primary" indicator-color="black"
            align="justify">
            <q-tab name="asignar" label="Asignar Órdenes" />
            <q-tab name="verificacion" label="Ordenes Pendientes" />
            <q-tab name="finalizadas" label="Órdenes Finalizadas" />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <!-- PANEL ASIGNAR -->
            <q-tab-panel name="asignar">
              <p class="text-center text-h5">Asignar Orden</p>
              <div class="q-gutter-sm">
                <div class="row col-12 q-gutter-sm">
                  <q-input v-model="filtros.texto" filled label="Buscar por número o usuario"
                    class="col-xs-12 col-sm-6 col-md-5 col-lg" @keyup.enter="consultarOrdenes" />
                  <q-input v-model="filtros.fechaInicio" filled type="date" label="Fecha Inicio"
                    class="col-xs-12 col-sm-6 col-md-3 col-lg" />
                  <q-input v-model="filtros.fechaFin" filled type="date" label="Fecha Fin"
                    class="col-xs-12 col-sm-6 col-md-3 col-lg" />
                  <q-btn color="primary" label="Buscar" icon="search" @click="consultarOrdenes"
                    class="col-xs-12 col-sm-2" />
                </div>

                <q-table flat bordered title="Órdenes" :rows="rows" :columns="columns" row-key="CodigoRadicado"
                  selection="multiple" v-model:selected="ordenes" :loading="loading"
                  no-data-label="No se encontraron órdenes" />

                <div class="row q-col-gutter-md">

                  <!-- SELECT DE CARGO -->
                  <q-select v-model="cargoSeleccionado" :options="Cargos" option-label="Nombre" option-value="IdRol"
                    label="Cargo" clearable emit-value map-options class="col-6"
                    @update:model-value="filtrarUsuariosPorCargo" />

                  <!-- SELECT DE USUARIO -->
                  <q-select v-model="usuarioSeleccionado" :options="usuariosFiltrados" option-label="NombreCompleto"
                    option-value="IdUsuario" label="Usuario" use-input emit-value map-options clearable class="col-6"
                    :disable="!cargoSeleccionado" @filter="filtrarUsuarios">
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <q-icon name="person" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.NombreCompleto }}</q-item-label>
                          <q-item-label caption>{{ scope.opt.Identificacion }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>

                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey-10">Sin resultados</q-item-section>
                      </q-item>
                    </template>
                  </q-select>

                </div>

                <q-btn @click="AsignarOrdenBd" label="Asignar ordenes" color="black" />

              </div>
            </q-tab-panel>

            <!-- PANEL VERIFICACIÓN -->
            <q-tab-panel name="verificacion">
              <p class="text-center text-h5">Ordenes Pendientes</p>
              <q-table flat bordered title="Órdenes" :rows="rowsDos" :columns="columns" row-key="CodigoRadicado"
                selection="multiple" v-model:selected="ordenes" :loading="loading"
                no-data-label="No se encontraron órdenes" />
            </q-tab-panel>

            <!-- PANEL FINALIZADAS -->
            <q-tab-panel name="finalizadas">
              <p class="text-center text-h5">Órdenes finalizadas</p>
              <p class="text-h6 text-grey">Próximamente</p>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </main>
    </section>
    <q-dialog v-model="assignment" full-width :maximized="fullscreen" persistent>
      <!-- <q-card class="q-pa-none" style="max-width: 100vw; height: 100vh; border-radius: 0;">
        <q-toolbar class="bg-blue-grey-9 text-white">
          <q-toolbar-title>Asignar Órdenes</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup @click="VaciarObservacion" />
        </q-toolbar>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div v-for="orden in ordenes" :key="orden.IdPqrs" class="col-xs-12 col-sm-6 col-md-4">
              <q-card class="my-card q-pa-sm shadow-3 bg-grey-1">
                <q-card-section>
                  <div class="text-h6 text-primary">
                    {{ orden.CodigoRadicado }}
                  </div>
                  <div class="text-body2 text-grey-8">
                    <q-icon name="person" size="16px" /> {{ orden.Usuario }}
                  </div>
                  <div class="text-body2 text-grey-8">
                    <q-icon name="place" size="16px" /> {{ orden.Barrio }} - {{ orden.Direccion }}
                  </div>
                  <div class="text-caption text-grey-7 q-mt-xs">
                    <q-icon name="event" size="14px" />
                    {{ Utils.formatearFecha(orden.FechaRadicado) }}
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-actions align="around">
                  <q-btn dense color="primary" icon="person_add" label="Asignar Técnico"
                    @click="abrirAsignarTecnico(orden)" />
                  <q-btn dense flat color="secondary" icon="groups" label="Ver Técnicos" @click="verTecnicos(orden)" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card> -->

      <!-- 🔹 Dialogo para asignar técnico -->
      <!-- <q-dialog v-model="dialogAsignar">
        <q-card style="width: 500px; max-width: 90vw;">
          <q-card-section class="q-pa-md">
            <div class="text-h6 text-primary q-mb-md">
              Asignar técnico a {{ ordenSeleccionada?.CodigoRadicado }}
            </div>

            <q-select ref="TecnicoRef" clearable use-input emit-value map-options color="blue-grey-8"
              option-label="NombreCompleto" v-model="tecnicoSeleccionado" :options="Tecnicos" label="Buscar técnico"
              @filter="filtrarTecnicos" :loading="loadingTecnicos">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="engineering" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.NombreCompleto }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.Identificacion }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">Sin resultados</q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="row justify-end q-mt-md">
              <q-btn color="primary" label="Asignar" @click="asignarTecnico" />
              <q-btn flat label="Cancelar" color="grey" v-close-popup class="q-ml-sm" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog> -->

      <!-- 🔹 Dialogo para ver/eliminar técnicos -->
      <!-- <q-dialog v-model="dialogVerTecnicos">
        <q-card style="width: 400px; max-width: 90vw;">
          <q-toolbar class="bg-blue-grey-9 text-white">
            <q-toolbar-title>
              Técnicos asignados a {{ ordenSeleccionada?.CodigoRadicado }}
            </q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>

          <q-card-section>
            <q-list bordered separator>
              <q-item v-for="(tec, index) in ordenSeleccionada?.Tecnicos || []" :key="index">
                <q-item-section avatar>
                  <q-icon name="engineering" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ tec.NombreCompleto }}</q-item-label>
                  <q-item-label caption>{{ tec.Identificacion }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn icon="delete" flat color="negative" dense @click="eliminarTecnico(index)">
                    <q-tooltip>Eliminar técnico</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-list>

            <div v-if="(ordenSeleccionada?.Tecnicos || []).length === 0" class="text-center text-grey q-mt-md">
              No hay técnicos asignados
            </div>
          </q-card-section>
        </q-card>
      </q-dialog> -->
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import { useRouter, useRoute } from 'vue-router';
import EncabezadoParametros from 'src/components/EncabezadoParametros.vue'
import Utils from 'src/Commons/Utils'
const route = useRoute()
const router = useRouter()
const fullscreen = ref(true)
const tab = ref('asignar')
const rows = ref([])
const rowsDos = ref([])
const assignment = ref(false)
const ordenes = ref([])
const loading = ref(false)
const Usuario = ref({})
const filtros = ref({
  texto: '',
  fechaInicio: '',
  fechaFin: ''
})

const columns = [
  { name: 'CodigoRadicado', align: 'center', label: 'Código PQRS', field: 'CodigoRadicado', sortable: true },
  { name: 'Usuario', align: 'center', label: 'Usuario', field: 'Usuario', sortable: true },
  { name: 'FechaCFechaRadicadoreacion', align: 'center', label: 'Fecha', field: 'FechaRadicado', format: (val) => Utils.formatearFecha(val) },
  { name: 'Telefono', align: 'center', label: 'Teléfono', field: 'Telefono' },
  { name: 'Barrio', align: 'center', label: 'Barrio', field: 'Barrio' },
  { name: 'Direccion', align: 'center', label: 'Dirección', field: 'Direccion' },
  { name: 'CreadorOrden', align: 'center', label: 'Creador Orden', field: 'CreadorOrden' }
]

const dialogAsignar = ref(false);
const dialogVerTecnicos = ref(false);
const tecnicoSeleccionado = ref(null);
const Tecnicos = ref([]);
const Cargos = ref([]) // Lista de cargos
const usuariosFiltrados = ref([]) // Usuarios del cargo seleccionado
const cargoSeleccionado = ref(null)
const usuarioSeleccionado = ref(null)
const loadingTecnicos = ref(false);
const ordenSeleccionada = ref(null);

const abrirAsignarTecnico = (orden) => {
  ordenSeleccionada.value = orden;
  tecnicoSeleccionado.value = null;
  dialogAsignar.value = true;
};

const verTecnicos = (orden) => {
  ordenSeleccionada.value = orden;
  dialogVerTecnicos.value = true;
};

const asignarTecnico = () => {
  Utils.loadingNotify(true, 'Cargando...')
  console.log(tecnicoSeleccionado.value)

  if (tecnicoSeleccionado.value) {
    const tecnico = Tecnicos.value.find(
      (t) => t.NombreCompleto === tecnicoSeleccionado.value.NombreCompleto
    )

    if (tecnico) {
      // 🛠️ Aseguramos que el arreglo exista antes de usar push
      if (!ordenSeleccionada.value.Tecnicos) {
        ordenSeleccionada.value.Tecnicos = []
      }

      // ⚠️ Evitar duplicados
      const yaExiste = ordenSeleccionada.value.Tecnicos.some(
        (t) => t.IdTercero === tecnico.IdTercero
      )

      if (yaExiste) {
        Utils.notificacion("Tecnico ya fue asignado a esta orden", false)
        Utils.loadingNotify(false, '')
        return
      }

      // ✅ Ahora sí se puede agregar sin errores
      ordenSeleccionada.value.Tecnicos.push(tecnico)
      console.log(ordenSeleccionada)
      console.log('asignado')
    }

    // dialogAsignar.value = false // si usas un modal

    // AsignarOrdenBd(tecnico);



    Utils.loadingNotify(false, '')
  }

}


const filtrarUsuariosPorCargo = async (idCargo) => {
  if (!idCargo) {
    usuariosFiltrados.value = []
    return
  }

  try {
    // 🔹 Puedes traer los usuarios por cargo directamente del backend:
    const response = await Utils.peticion('GET', `usuario/${idCargo}/${Usuario.value.IdEmpresa}/usuario-por-cargo`)
    usuariosFiltrados.value = response.data || []
  } catch (error) {
    console.error('Error al filtrar usuarios por cargo:', error)
  }
}


const TraerCargos = async () => {

  const response = await api.get(`/ordenservicio/${Usuario.value.IdEmpresa}/traer-cargos-empresa`)


  Cargos.value = response.data
}

const AsignarOrdenBd = async () => {
  // const IdPqrs = ordenSeleccionada.value.IdPqrs
  const tramites = []
  console.log(ordenes.value)

  ordenes.value.forEach((orden) => {
    tramites.push({
      IdPqrs: orden.IdPqrs,
      IdUsuarioA: Usuario.value.IdUsuario,
      IdUsuario: usuarioSeleccionado.value
    })

  })

  console.log(tramites)



  const response = await api.post('/ordenservicio/asignar-tecnicos-orden', tramites)
  Utils.notificacion("Se asginaron ordenes", response.data.IsExito)
  Utils.loadingNotify(false, '')

  consultarOrdenes()
  cargoSeleccionado.value = ''
  usuarioSeleccionado.value = ''

}


const eliminarTecnico = (index) => {
  ordenSeleccionada.value.Tecnicos.splice(index, 1);
};



const filtrarTecnicos = async (filtro, update) => {
  if (!filtro || filtro.trim() === '') return

  try {
    const response = await Utils.peticion('GET', `usuario/${Usuario.value.IdEmpresa}/empresa/${filtro}/traer-tecnicos-empresa`)
    console.log(response)
    update(() => {
      Tecnicos.value = response.data || []
    })
  } catch (error) {
    console.error('Error al filtrar:', error)
  }
}


const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString();
};

const VaciarObservacion = () => {
  dialogAsignar.value = false;
  dialogVerTecnicos.value = false;
};
/**
 * Consulta las órdenes según filtros
 */
const consultarOrdenes = async () => {

  console.log(Usuario.value)

  const response = await api.get(`/ordenservicio/${Usuario.value.IdEmpresa}/${1}/traer-ordenes-empresa-estado`)
  rows.value = response.data
  console.log()

}


const consultarOrdenesSegundoEstado = async () => {

  console.log(Usuario.value)

  const response = await api.get(`/ordenservicio/${Usuario.value.IdEmpresa}/${3}/traer-ordenes-empresa-estado`)
  rowsDos.value = response.data
  console.log()

}


/**
 * Acción para asignar las órdenes seleccionadas
 */
const asignarOrdenes = async () => {
  if (selected.value.length === 0) return
  try {
    const response = await api.post('/ordenServicio/asignar-ordenes', selected.value)
    console.log('Asignadas:', response.data)
  } catch (error) {
    console.error('Error al asignar órdenes:', error)
  }
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
  consultarOrdenesSegundoEstado()
  TraerCargos()
})
</script>
<style scoped>
.hover-card {
  transition: all 0.2s ease-in-out;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rounded-borders {
  border-radius: 12px;
}
</style>
