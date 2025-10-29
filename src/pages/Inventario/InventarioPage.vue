<template>
  <q-page class="q-pa-md bg-grey-2">
    <q-card flat bordered class="q-pa-md">

      <div class="row items-center justify-between q-mb-md">
        <div class="text-h5 text-primary">
          Inventario de Materiales
        </div>

        <q-btn
          color="primary"
          icon="add"
          label="Agregar material"
          @click="abrirDialogoNuevo"
          unelevated
        />
      </div>

      <!-- FILTROS -->
      <div class="row q-col-gutter-md q-mb-md">
        <q-input
          filled
          v-model="filtros.busqueda"
          label="Buscar por nombre o código"
          dense
          class="col-12 col-md-4"
        />

        <q-select
          filled
          v-model="filtros.categoria"
          :options="categorias"
          label="Categoría"
          dense
          clearable
          class="col-12 col-md-3"
        />

        <q-select
          filled
          v-model="filtros.marca"
          :options="marcas"
          label="Marca"
          dense
          clearable
          class="col-12 col-md-3"
        />
      </div>

      <!-- TABLA -->
      <q-table
        :rows="productosFiltrados"
        :columns="columnas"
        row-key="id"
        flat
        bordered
        dense
        :pagination.sync="paginacion"
      >
        <template #body-cell-acciones="props">
          <q-td align="center">
            <q-btn icon="edit" size="sm" color="primary" flat round @click="editarProducto(props.row)" />
            <q-btn icon="delete" size="sm" color="negative" flat round @click="eliminarProducto(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- DIALOGO AGREGAR / EDITAR -->
    <q-dialog v-model="dialogoActivo" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">
          {{ modoEdicion ? 'Editar material' : 'Agregar material' }}
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-md">
            <q-input v-model="productoActual.nombre" label="Nombre del material" filled dense />
            <q-input v-model="productoActual.codigo" label="Código" filled dense />
            <q-select v-model="productoActual.categoria" :options="categorias" label="Categoría" filled dense />
            
            <q-select
              v-if="productoActual.categoria === 'Luminarias'"
              v-model="productoActual.marca"
              :options="marcas"
              label="Marca"
              filled
              dense
            />

            <q-input v-model.number="productoActual.stock" label="Stock disponible" type="number" filled dense />
            <q-input v-model.number="productoActual.precio" label="Costo unitario" prefix="$" type="number" filled dense />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn color="primary" label="Guardar" @click="guardarProducto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const categorias = [
  'Luminarias',
  'Collarines',
  'Brazos',
  'Fotoceldas',
  'Cableado',
  'Herrajes',
  'Otros'
]

const marcas = [
  'Assic – Nautilus',
  'Alutrafic',
  'Celsa',
  'Imporled',
  'Mercury',
  'RoyAlpha',
  'Sylvania'
]

const filtros = ref({
  busqueda: '',
  categoria: null,
  marca: null
})

const productos = ref([
  {
    id: 1,
    codigo: 'LUM100',
    nombre: 'Luminaria LED 100W',
    categoria: 'Luminarias',
    marca: 'RoyAlpha',
    stock: 25,
    precio: 180000
  },
  {
    id: 2,
    codigo: 'COL015',
    nombre: 'Collarín galvanizado 1.5”',
    categoria: 'Herrajes',
    marca: null,
    stock: 10,
    precio: 9500
  },
  
    {
    id: 3,
    codigo: 'LUM102',
    nombre: 'Luminaria LED 50W',
    categoria: 'Luminarias',
    marca: 'Sylvania',
    stock: 25,
    precio: 180000
  },
  {
    id: 4,
    codigo: 'COL016',
    nombre: 'Collarín galvanizado 2.0”',
    categoria: 'Herrajes',
    marca: null,
    stock: 50,
    precio: 9500
  }
])

const columnas = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left' },
  { name: 'nombre', label: 'Material', field: 'nombre', align: 'left' },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left' },
  { name: 'stock', label: 'Stock', field: 'stock', align: 'center' },
  { name: 'precio', label: 'Costo Unitario', field: 'precio', align: 'right', format: val => `$${val.toLocaleString()}` },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

const paginacion = ref({ rowsPerPage: 10 })

const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(filtros.value.busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(filtros.value.busqueda.toLowerCase())
    const coincideCategoria = !filtros.value.categoria || p.categoria === filtros.value.categoria
    const coincideMarca = !filtros.value.marca || p.marca === filtros.value.marca
    return coincideBusqueda && coincideCategoria && coincideMarca
  })
})

// Dialogo CRUD
const dialogoActivo = ref(false)
const productoActual = ref({})
const modoEdicion = ref(false)

const abrirDialogoNuevo = () => {
  productoActual.value = { nombre: '', codigo: '', categoria: '', marca: null, stock: 0, precio: 0 }
  modoEdicion.value = false
  dialogoActivo.value = true
}

const editarProducto = (producto) => {
  productoActual.value = { ...producto }
  modoEdicion.value = true
  dialogoActivo.value = true
}

const guardarProducto = () => {
  if (modoEdicion.value) {
    const index = productos.value.findIndex(p => p.id === productoActual.value.id)
    if (index !== -1) productos.value[index] = { ...productoActual.value }
  } else {
    productoActual.value.id = Date.now()
    productos.value.push({ ...productoActual.value })
  }
  dialogoActivo.value = false
}

const eliminarProducto = (producto) => {
  productos.value = productos.value.filter(p => p.id !== producto.id)
}
</script>
