<template>
  <div>
    <template v-for="menu in items" :key="menu.IdMenu">
      <!-- Versión móvil: expandir inline debajo del ítem -->
      <template v-if="$q.screen.lt.md">
        <!-- Nodo hoja -->
        <template v-if="!menu?.Menus || menu.Menus.length === 0">
          <q-item v-if="!menu.IsOculto"
                  :class="{ 'clase-activa': idMenuActivo === menu.IdMenu }"
                  clickable v-ripple :content-inset-level="level"
                  @click="toggle(menu.IdMenu)">
            <q-item-section avatar>
              <q-icon color="grey-9" :name="menu.Icono" />
            </q-item-section>
            <q-item-section>{{ menu.Nombre }}</q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" class="chev" :class="{ expanded: isExpanded(menu.IdMenu) }" />
            </q-item-section>
          </q-item>
          <!-- Vistas del menú (hoja) -->
          <div v-show="isExpanded(menu.IdMenu) && menu?.Vistas?.length" class="q-ml-md q-my-xs">
            <q-item v-for="(vista, vi) in menu.Vistas" :key="vi" clickable v-ripple dense @click="irAVista(vista)">
              <q-item-section avatar>
                <q-icon color="grey-8" :name="vista.IconoVista || 'chevron_right'" />
              </q-item-section>
              <q-item-section>{{ vista.NombreVista }}</q-item-section>
            </q-item>
          </div>
        </template>
        <!-- Nodo con hijos -->
        <template v-else>
          <div v-if="!menu.IsOculto">
            <q-item clickable v-ripple :content-inset-level="level" @click="toggle(menu.IdMenu)">
              <q-item-section avatar>
                <q-icon color="grey-9" :name="menu.Icono" />
              </q-item-section>
              <q-item-section>{{ menu.Nombre }}</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" class="chev" :class="{ expanded: isExpanded(menu.IdMenu) }" />
              </q-item-section>
            </q-item>
            <div v-show="isExpanded(menu.IdMenu)" class="q-ml-md q-my-xs">
              <MenuDinamico :items="menu.Menus" :idMenuActivo="idMenuActivo" :level="level + 1"
                            @seleccionar="emitSeleccion" />
              <!-- Vistas del menú (con hijos) -->
              <div v-if="menu?.Vistas?.length" class="q-mt-xs">
                <q-item v-for="(vista, vi) in menu.Vistas" :key="vi" clickable v-ripple dense @click="irAVista(vista)">
                  <q-item-section avatar>
                    <q-icon color="grey-8" :name="vista.IconoVista || 'chevron_right'" />
                  </q-item-section>
                  <q-item-section>{{ vista.NombreVista }}</q-item-section>
                </q-item>
              </div>
            </div>
          </div>
        </template>
      </template>

      <!-- Versión desktop: comportamiento actual con q-expansion-item -->
      <template v-else>
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
    </template>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import MenuDinamico from "./MenuDinamico.vue"

const $q = useQuasar()
const router = useRouter()

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

// Estado de expansión para móvil
const expandedSet = ref(new Set())
const isExpanded = (id) => expandedSet.value.has(id)
const toggle = (id) => {
  const s = new Set(expandedSet.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  expandedSet.value = s
}

// Navegar directamente a una vista (versión móvil)
const irAVista = (vista) => {
  if (!vista || !vista.Ruta) return
  router.push(vista.Ruta)
}
</script>

<style scoped>
.clase-activa {
  background-color: #e0f7fa;
  font-weight: bold;
}
.chev {
  transition: transform .15s ease;
}
.chev.expanded {
  transform: rotate(90deg);
}
</style>