<template>
  <div>
    <template v-for="menu in items" :key="menu.IdMenu">

      <template v-if="!menu?.Menus || menu.Menus.length === 0">
        <q-item  v-if="!menu.IsOculto" :class="{ 'clase-activa': idMenuActivo === menu.IdMenu }" @click="emitSeleccion(menu)" clickable
          v-ripple :content-inset-level="level">
          <q-item-section avatar>
            <q-icon color="grey-9" :name="menu.Icono" />
          </q-item-section>
          <q-item-section>{{ menu.Nombre }}</q-item-section>
        </q-item>
      </template>

      <template v-else>
        <q-expansion-item v-if="!menu.IsOculto" :label="menu.Nombre" :icon="menu.Icono" :content-inset-level="0.5" expand-separator
          default-closed>
          <MenuDinamico :items="menu.Menus" :idMenuActivo="idMenuActivo" :level="level + 1"
            @seleccionar="emitSeleccion" />
        </q-expansion-item>
      </template>
    </template>
  </div>
</template>

<script setup>
import MenuDinamico from "./MenuDinamico.vue"


defineProps({
  items: Array,
  level: {
    type: Number,
    default: 0
  },
  idMenuActivo: Number
})

const emit = defineEmits(['seleccionar'])

const emitSeleccion = (menu) => {
  emit('seleccionar', menu)
}
</script>

<style scoped>
.clase-activa {
  background-color: #e0f7fa;
  font-weight: bold;
}
</style>