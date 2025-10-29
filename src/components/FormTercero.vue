<template>
    <q-form @submit.prevent="guardarTercero" class="q-gutter-md">
        <div class="row q-col-gutter-md">
            <q-select v-model="tercero.IdTipoIdentificacion" :options="tiposIdentificacion"
                label="Tipo de Identificación" option-label="label" emit-value map-options option-value="value" class="col-12 col-md-6"
                outlined />
            <q-input v-model="tercero.Identificacion" label="Identificación" class="col-12 col-md-6" outlined />



            <q-input v-model="tercero.Nombres" label="Nombres" class="col-12 col-md-6" outlined />
            <q-input v-model="tercero.Apellido1" label="Primer Apellido" class="col-12 col-md-6" outlined />
            <q-input v-model="tercero.Apellido2" label="Segundo Apellido" class="col-12 col-md-6" outlined />
            <q-input v-model="tercero.Correo" label="Correo" type="email" class="col-12 col-md-6" outlined />
            <q-input v-model="tercero.Telefono" label="Teléfono" class="col-12 col-md-6" outlined />
            <q-input v-model="tercero.Direccion" label="Dirección" class="col-12 col-md-6" outlined />

            <q-select v-model="tercero.IdBarrio" :options="barrios" option-label="NombreBarrio" option-value="IdBarrio"
                label="Barrio" class="col-12 col-md-6" outlined emit-value map-options />

          



        </div>

        <div class="q-mt-md flex justify-end">
            <q-btn flat label="Cancelar" color="black" v-close-popup />
            <q-btn label="Guardar" color="grey-7" type="submit" class="q-ml-sm" />
        </div>
    </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import Utils from 'src/Commons/Utils'
// Props
const props = defineProps({
    terceroData: { type: Object, default: () => ({}) },
    isDialogActivado: { type: Boolean, default: false }
})
const Usuario = ref({})
const emit = defineEmits(['tercero-guardado', 'tercero-modificado'])

// Data
const tercero = ref({

    IdTipoIdentificacion: null,
    Identificacion: '',
    Nombres: '',
    Apellido1: '',
    Apellido2: '',
    Correo: '',
    Telefono: '',
    NombreCompleto: '',
    Direccion: '',
    IdEmpresa: '',
    IdBarrio: '',
    IdUsuarioC: '',

})

// Opciones para selects
const tiposIdentificacion = [
    { label: 'Cédula de Ciudadanía', value: 1 },
    { label: 'NIT', value: 2 },
    { label: 'Cédula de Extranjería', value: 3 },
    { label: 'Pasaporte', value: 4 }
]

// const  TraerTiposIdentificacion = async ()=>{


//        const response = await api.get('/tercero/traer-identificaciones')
//        tiposIdentificacion.value = response.data
//        console.log(response.data)
// }


const tiposPersona = [
    { label: 'Natural', value: 1 },
    { label: 'Jurídica', value: 2 }
]

// Ejemplo de barrios (estos deberías cargarlos desde tu API)
const barrios = ref([
    { IdBarrio: 1, NombreBarrio: 'Centro' },
    { IdBarrio: 2, NombreBarrio: 'La Esperanza' },
    { IdBarrio: 3, NombreBarrio: 'Las Flores' }
])


// Si llegan datos por props, los cargamos
watch(() => props.terceroData, (nuevo) => {
    if (nuevo) Object.assign(tercero.value, nuevo)
}, { immediate: true })

const guardarTercero = async () => {
    tercero.value.NombreCompleto = `${tercero.value.Nombres} ${tercero.value.Apellido1} ${tercero.value.Apellido2}`.trim()
    tercero.value.IdUsuarioC = Usuario.value.IdUsuario
    tercero.value.IdEmpresa = Usuario.value.IdEmpresa
    console.log(tercero.value)
    // Aquí puedes hacer el POST o PUT a tu API
    // Por ejemplo:
    // await api.post('/api/Tercero', tercero.value)
    const response = await api.post('/tercero/crear-tercero', tercero.value) // 👈 aquí está la diferencia
    


    emit('tercero-guardado', response.data)
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
    // TraerTiposIdentificacion()
    // 

})
</script>
