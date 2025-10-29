<template>
  <q-page padding>
    <!-- ========================== -->
    <!-- ENCABEZADO GENERAL -->
    <!-- ========================== -->
    <q-card class="q-pa-md shadow-3">
      <q-card-section class="bg-blue-10 text-white text-h6">
        Gestión de Solicitudes de Materiales y Devoluciones
      </q-card-section>

      <q-tabs
        v-model="tab"
        dense
        class="text-grey-8"
        active-color="primary"
        indicator-color="primary"
      >
        <q-tab name="solicitudes" label="Solicitud de Material" icon="add_circle_outline" />
        <q-tab name="devoluciones" label="Solicitud de Devolución" icon="undo" />
      </q-tabs>
    </q-card>

    <!-- ========================== -->
    <!-- SOLICITUD DE MATERIALES -->
    <!-- ========================== -->
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="solicitudes">
        <q-card class="q-mt-md shadow-2">
          <q-card-section class="bg-blue-2 text-h6">
            Solicitud de Material por Técnico
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-input filled class="col-12 col-md-4" label="Técnico" v-model="solicitud.Tecnico" />
              <q-input filled class="col-12 col-md-4" label="Orden de Servicio" v-model="solicitud.OrdenServicio" />

              <q-select
                filled
                class="col-12 col-md-4"
                label="Material"
                v-model="solicitud.Material"
                :options="inventario"
                option-label="Nombre"
                option-value="Id"
                emit-value
                map-options
              />

              <q-input
                filled
                class="col-12 col-md-2"
                label="Cantidad Solicitada"
                type="number"
                v-model.number="solicitud.Cantidad"
                min="1"
              />
            </div>

            <div class="q-mt-md">
              <q-btn
                color="primary"
                label="Registrar Solicitud"
                icon="add_circle"
                @click="registrarSolicitud"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Tabla de solicitudes -->
        <q-card class="q-mt-lg shadow-2">
          <q-card-section class="bg-grey-3 text-h6">Solicitudes Realizadas</q-card-section>
          <q-table :rows="solicitudes" :columns="columnas" row-key="id" dense flat>
            <template v-slot:body-cell-estado="props">
              <q-chip
                :color="props.row.Estado === 'Pendiente' ? 'orange' : 'green'"
                text-color="white"
              >
                {{ props.row.Estado }}
              </q-chip>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- ========================== -->
      <!-- SOLICITUD DE DEVOLUCIÓN -->
      <!-- ========================== -->
      <q-tab-panel name="devoluciones">
        <q-card class="q-mt-md shadow-2">
          <q-card-section class="bg-green-2 text-h6">
            Solicitud de Devolución de Material
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <q-input filled class="col-12 col-md-4" label="Técnico" v-model="devolucion.Tecnico" />
              <q-input filled class="col-12 col-md-4" label="Orden de Servicio" v-model="devolucion.OrdenServicio" />

              <q-select
                filled
                class="col-12 col-md-4"
                label="Material a Devolver"
                v-model="devolucion.Material"
                :options="solicitudes.map(s => ({ label: s.MaterialNombre, value: s.MaterialNombre }))"
                emit-value
                map-options
              />

              <q-input
                filled
                class="col-12 col-md-2"
                label="Cantidad a Devolver"
                type="number"
                v-model.number="devolucion.Cantidad"
                min="1"
              />
            </div>

            <div class="q-mt-md">
              <q-btn
                color="green"
                label="Registrar Devolución"
                icon="undo"
                @click="registrarDevolucion"
              />
            </div>
          </q-card-section>
        </q-card>

        <!-- Tabla de devoluciones -->
        <q-card class="q-mt-lg shadow-2">
          <q-card-section class="bg-grey-3 text-h6">Devoluciones Registradas</q-card-section>
          <q-table :rows="devoluciones" :columns="columnasDevoluciones" row-key="id" dense flat>
            <template v-slot:body-cell-estado="props">
              <q-chip
                :color="props.row.Estado === 'Pendiente' ? 'orange' : 'blue'"
                text-color="white"
              >
                {{ props.row.Estado }}
              </q-chip>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('solicitudes')

const inventario = ref([
  { Id: 1, Nombre: 'Luminaria Assic – Nautilus' },
  { Id: 2, Nombre: 'Luminaria Sylvania' },
  { Id: 3, Nombre: 'Collarín Alutrafic' },
  { Id: 4, Nombre: 'Luminaria Mercury' },
  { Id: 5, Nombre: 'Poste Imporled' },
  { Id: 6, Nombre: 'Luminaria Celsa' },
  { Id: 7, Nombre: 'Luminaria RoyAlpha' }
])

// ==============================
// Datos de solicitud de materiales
// ==============================
const solicitud = ref({
  Tecnico: '',
  OrdenServicio: '',
  Material: null,
  Cantidad: 0
})

const solicitudes = ref([])

const columnas = [
  { name: 'fecha', label: 'Fecha', field: 'Fecha', align: 'left' },
  { name: 'tecnico', label: 'Técnico', field: 'Tecnico', align: 'left' },
  { name: 'orden', label: 'Orden', field: 'OrdenServicio', align: 'center' },
  { name: 'material', label: 'Material', field: 'MaterialNombre', align: 'left' },
  { name: 'cantidad', label: 'Cantidad', field: 'Cantidad', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'Estado', align: 'center' }
]

// ==============================
// Datos de devoluciones
// ==============================
const devolucion = ref({
  Tecnico: '',
  OrdenServicio: '',
  Material: null,
  Cantidad: 0
})

const devoluciones = ref([])

const columnasDevoluciones = [
  { name: 'fecha', label: 'Fecha', field: 'Fecha', align: 'left' },
  { name: 'tecnico', label: 'Técnico', field: 'Tecnico', align: 'left' },
  { name: 'orden', label: 'Orden', field: 'OrdenServicio', align: 'center' },
  { name: 'material', label: 'Material', field: 'Material', align: 'left' },
  { name: 'cantidad', label: 'Cantidad', field: 'Cantidad', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'Estado', align: 'center' }
]

// ==============================
// Funciones
// ==============================
function registrarSolicitud() {
  if (!solicitud.value.Tecnico || !solicitud.value.OrdenServicio || !solicitud.value.Material || solicitud.value.Cantidad <= 0) {
    alert('Por favor completa todos los campos antes de registrar la solicitud.')
    return
  }

  const material = inventario.value.find(m => m.Id === solicitud.value.Material)
  solicitudes.value.push({
    id: Date.now(),
    Fecha: new Date().toLocaleString(),
    Tecnico: solicitud.value.Tecnico,
    OrdenServicio: solicitud.value.OrdenServicio,
    MaterialNombre: material.Nombre,
    Cantidad: solicitud.value.Cantidad,
    Estado: 'Pendiente'
  })

  solicitud.value = { Tecnico: '', OrdenServicio: '', Material: null, Cantidad: 0 }
}

function registrarDevolucion() {
  if (!devolucion.value.Tecnico || !devolucion.value.OrdenServicio || !devolucion.value.Material || devolucion.value.Cantidad <= 0) {
    alert('Por favor completa todos los campos antes de registrar la devolución.')
    return
  }

  devoluciones.value.push({
    id: Date.now(),
    Fecha: new Date().toLocaleString(),
    Tecnico: devolucion.value.Tecnico,
    OrdenServicio: devolucion.value.OrdenServicio,
    Material: devolucion.value.Material,
    Cantidad: devolucion.value.Cantidad,
    Estado: 'Pendiente'
  })

  devolucion.value = { Tecnico: '', OrdenServicio: '', Material: null, Cantidad: 0 }
}
</script>
