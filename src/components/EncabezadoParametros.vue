<template>
    <header :style="headerStyle"
    style="background-image: url('icons/bannerconfig.png'); ; background-position: center ; background-size: cover; box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset; background-repeat: no-repeat;"
    class="row q-mb-sm justify-between items-start">

    <span class="row full-height col justify-between items-center">
      <span  class="row justify-center items-center">
        <q-btn v-if="!mostrarVolver" icon="arrow_back" flat color="grey-9" @click="volverAtras" name="person" />
        <h5 class="row q-ma-none text-center text-body q-ml-sm q-mr-sm text-grey-9">
          {{ parteUno }} - 
          <h5 class="q-ma-none text-secundario"> {{ parteDos }}</h5>
        </h5>
      </span>

      <div class="row col-md-6 q-pa-sm row justify-end col-sm-6 col-xs-12 q-gutter-sm">
        <slot name="botones" />
      </div>
    </span>

  </header>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
const $q = useQuasar()
const router = useRouter()
const volverAtras = () => router.go(-1)

defineProps({
    parteUno: String,
    mostrarVolver: Boolean,
    parteDos: String
})

const headerStyle = computed(() => {
  if ($q.screen.lt.md) {
    return { height: '70px' }
  } else {
    return { height: '70px', position: 'sticky', top: '0', zIndex: '9', backgroundColor: '#EBEBF0' }
  }
})
</script>
