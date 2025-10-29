<template>
    <q-page padding>
        <q-card class="q-pa-md shadow-2">
            <q-card-section class="bg-blue-10 text-white text-h6">
                Registro de Movimientos de Inventario
            </q-card-section>

            <q-card-section>
                <div class="row q-col-gutter-md">
                    <q-select filled class="col-12 col-md-4" label="Tipo de Movimiento" v-model="movimiento.Tipo"
                        :options="tiposMovimiento" emit-value map-options />

                    <q-select filled class="col-12 col-md-4" label="Material" v-model="movimiento.Material"
                        :options="inventario" option-label="Nombre" option-value="Id" emit-value map-options />

                    <q-input filled class="col-12 col-md-2" label="Cantidad" type="number"
                        v-model.number="movimiento.Cantidad" min="1" />

                    <q-input filled class="col-12 col-md-4" label="Orden de Servicio"
                        v-model="movimiento.OrdenServicio" />

                    <q-input filled class="col-12 col-md-4" label="Técnico Responsable" v-model="movimiento.Tecnico" />
                </div>

                <div class="q-mt-md">
                    <q-btn color="primary" label="Registrar Movimiento" icon="add_circle"
                        @click="registrarMovimiento" />
                </div>
            </q-card-section>
        </q-card>

        <!-- Tabla de movimientos -->
        <q-card class="q-mt-lg shadow-2">
            <q-card-section class="bg-grey-3 text-h6">
                Historial de Movimientos
            </q-card-section>

            <q-table :rows="movimientos" :columns="columnas" row-key="id" dense flat />
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'

const tiposMovimiento = [
    { label: 'Entrada', value: 'entrada' },
    { label: 'Salida', value: 'salida' }
]

const inventario = ref([
    { Id: 1, Nombre: 'Luminaria Assic – Nautilus', Stock: 10 },
    { Id: 2, Nombre: 'Luminaria Sylvania', Stock: 15 },
    { Id: 3, Nombre: 'Collarín Alutrafic', Stock: 30 },
    { Id: 4, Nombre: 'Luminaria Mercury', Stock: 25 },
    { Id: 5, Nombre: 'Poste Imporled', Stock: 5 }
])

const movimiento = ref({
    Tipo: null,
    Material: null,
    Cantidad: 0,
    OrdenServicio: '',
    Tecnico: ''
})

const movimientos = ref([])

const columnas = [
    { name: 'fecha', label: 'Fecha', field: 'Fecha', align: 'left' },
    { name: 'tipo', label: 'Tipo', field: 'Tipo', align: 'left' },
    { name: 'material', label: 'Material', field: 'MaterialNombre', align: 'left' },
    { name: 'cantidad', label: 'Cantidad', field: 'Cantidad', align: 'center' },
    { name: 'orden', label: 'Orden', field: 'OrdenServicio', align: 'center' },
    { name: 'tecnico', label: 'Técnico', field: 'Tecnico', align: 'center' }
]

function registrarMovimiento() {
    if (!movimiento.value.Tipo || !movimiento.value.Material || movimiento.value.Cantidad <= 0) {
        alert('Por favor, completa los campos obligatorios.')
        return
    }

    const mat = inventario.value.find(m => m.Id === movimiento.value.Material)
    if (!mat) return

    if (movimiento.value.Tipo === 'salida') {
        if (mat.Stock < movimiento.value.Cantidad) {
            alert(`No hay suficiente stock de ${mat.Nombre}`)
            return
        }
        mat.Stock -= movimiento.value.Cantidad
    } else if (movimiento.value.Tipo === 'entrada') {
        mat.Stock += movimiento.value.Cantidad
    }

    movimientos.value.push({
        id: Date.now(),
        Fecha: new Date().toLocaleString(),
        Tipo: movimiento.value.Tipo,
        MaterialNombre: mat.Nombre,
        Cantidad: movimiento.value.Cantidad,
        OrdenServicio: movimiento.value.OrdenServicio,
        Tecnico: movimiento.value.Tecnico
    })

    movimiento.value = {
        Tipo: null,
        Material: null,
        Cantidad: 0,
        OrdenServicio: '',
        Tecnico: ''
    }
}
</script>
