<template>
  <q-page class="q-pa-none bg-grey-2" style="min-height: 75vh;">
    <div class="map-wrapper">
      <div id="map" class="map"></div>
      <q-card class="controls-panel q-pa-xs">
        <div class="row items-center justify-between q-gutter-xs">
          <div class="row items-center q-gutter-xs">
            <q-btn color="primary" outline :label="seleccionando ? 'Cancelar' : 'Seleccionar área'" icon="crop_square"
              @click="activarSeleccionArea" />
            <q-btn color="secondary" :label="mostrarBarrios ? 'Ocultar barrios' : 'Mostrar barrios'" icon="map"
              @click="toggleBarrios" />
            <q-btn color="negative" outline label="Limpiar" icon="clear_all" @click="limpiarSeleccion"
              :disable="seleccionados.length === 0" />
          </div>
          <div class="row items-center q-gutter-xs">
            <q-btn flat color="blue-grey-7" icon="filter_list" :outline="!mostrarFiltroEstados"
              :label="mostrarFiltroEstados ? 'Ocultar filtros' : 'Filtros'"
              @click="mostrarFiltroEstados = !mostrarFiltroEstados" />
            <q-btn color="primary" label="Continuar" icon="arrow_forward" @click="abrirOrden"
              :disable="seleccionados.length === 0" />
          </div>
        </div>

        <!-- Segunda cinta: modo de versiones de postes -->
        <div v-if="mostrarFiltroEstados" class="row items-center q-gutter-xs q-mt-xs filtros-estados-row">
          <div class="text-caption text-blue-grey-7 q-mr-xs">Visualización por versiones</div>

          <q-badge class="estado-pill cursor-pointer" :outline="!modoVersiones" color="blue-6" text-color="white"
            @click="modoVersiones = !modoVersiones">
            {{ modoVersiones ? 'Modo versiones activo' : 'Activar modo versiones' }}
          </q-badge>

          <div v-if="modoVersiones" class="text-caption text-blue-grey-6 q-ml-sm">
            Los postes se colorean según su versión actual. Al hacer clic verás el historial de versiones.
          </div>
        </div>
      </q-card>

      <!-- Diálogo de historial de versiones del poste -->
      <q-dialog v-model="dialogVersiones" persistent>
        <q-card style="width: 420px; max-width: 95vw;">
          <div class="row items-center justify-between q-pa-sm">
            <div>
              <div class="text-subtitle1 text-weight-bold">Historial de versiones</div>
              <div class="text-caption text-blue-grey-6">Poste {{ posteVersionesSeleccionado?.Descripcion || '' }}</div>
            </div>
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
          <q-separator />
          <q-card-section style="max-height: 60vh;" class="scroll">
            <div
              v-if="!posteVersionesSeleccionado || !posteVersionesSeleccionado.Versiones || !posteVersionesSeleccionado.Versiones.length"
              class="text-caption text-blue-grey-6">
              No hay versiones registradas para este poste.
            </div>
            <q-list v-else dense>
              <q-item v-for="(v, i) in posteVersionesSeleccionado.Versiones" :key="i">
                <q-item-section>
                  <q-item-label class="text-body2">
                    {{ v.Nombre || v.Version || ('Versión ' + (i + 1)) }}
                    <q-badge v-if="v.IsActivo" color="green-5" text-color="white" class="q-ml-xs" rounded>
                      Actual
                    </q-badge>
                  </q-item-label>
                  <q-item-label caption>
                    {{ v.Fecha || Utils.formatearFecha(v.FechaVersion) || '' }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-card v-if="seleccionados.length" class="selected-panel q-pa-sm">
        <div class="row items-center justify-between q-mb-xs">
          <div class="text-subtitle2 text-weight-bold">Postes seleccionados</div>
          <q-badge color="blue-7" class="text-white text-caption">{{ seleccionados.length }}</q-badge>
        </div>

        <q-virtual-scroll :items="seleccionados" style="max-height: 38vh">
          <template v-slot="{ item }">
            <q-item dense>
              <q-item-section avatar>
                <q-icon name="bolt" color="blue-grey-6" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="ellipsis">{{ item.Descripcion || ('Poste ' + (item.IdPoste || ''))
                  }}</q-item-label>
                <q-item-label caption v-if="item.IdPoste">ID: {{ item.IdPoste }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn dense flat round icon="close" size="sm" @click="quitarSeleccion(item)" />
              </q-item-section>
            </q-item>
            <q-separator inset />
          </template>
        </q-virtual-scroll>
      </q-card>
    </div>

    <q-dialog v-model="ordenDialog" full-width maximized>
      <q-card class="orden-dialog-card">
        <!-- Encabezado estilo GestionOrdenes -->
        <div class="row items-center justify-between q-pa-md orden-dialog-header">
          <div>
            <div class="text-h6 text-weight-bold">Ejecución de Orden</div>
            <div class="text-caption text-blue-grey-6">
              Configura técnico, estado y luminarias para los postes seleccionados
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup />
        </div>

        <q-separator />

        <!-- Contenido -->
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <!-- Columna izquierda: postes y luminarias -->
            <div class="col-12 col-md-8">
              <q-card flat bordered class="orden-section-card q-pa-md">
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-subtitle1 text-weight-bold">Postes y luminarias</div>
                  <q-badge v-if="seleccionados.length" color="blue-7" class="text-white">
                    {{ seleccionados.length }} seleccionados
                  </q-badge>
                </div>

                <div v-if="!seleccionados.length" class="text-grey q-mt-md text-center">
                  No hay postes seleccionados.
                </div>

                <q-virtual-scroll v-else class="col scroll q-mt-sm" :items="seleccionados" separator
                  style="max-height: 70vh;">
                  <template v-slot="{ item }">
                    <q-card flat bordered class="q-pa-sm q-mb-sm orden-poste-card">
                      <div class="text-body2 text-weight-medium q-mb-xs">
                        {{ item.Descripcion || `Poste ${item.IdPoste || ''}` }}
                      </div>

                      <q-select v-model="seleccionesLuminarias[item.IdPoste]" :options="luminariasOptions(item)"
                        emit-value map-options label="Luminaria" dense outlined
                        :loading="cargandoLuminariasId === item.IdPoste" @focus="cargarLuminarias(item)"
                        :disable="creandoOrden" />
                    </q-card>
                  </template>
                </q-virtual-scroll>
              </q-card>
            </div>

            <!-- Columna derecha: detalles de la orden -->
            <div class="col-12 col-md-4">
              <q-card flat bordered class="orden-section-card q-pa-md">
                <div class="text-subtitle1 text-weight-bold q-mb-sm">Detalles de la orden</div>

                <q-select v-model="tecnicoSeleccionado" :options="tecnicos" option-value="IdUsuario"
                  option-label="NombreCompleto" label="Técnico (opcional)" outlined dense emit-value map-options
                  :disable="creandoOrden" />

                <q-select v-model="estadoOrden" :options="estadosOrden" option-value="value" option-label="label"
                  label="Estado" outlined dense class="q-mt-sm" emit-value map-options :disable="creandoOrden" />

                <q-input v-model="observaciones" label="Observaciones" type="textarea" outlined dense autogrow
                  class="q-mt-sm" :disable="creandoOrden" />

                <!-- Botones -->
                <div class="q-mt-md row justify-end q-gutter-sm">
                  <q-btn flat label="Cancelar" color="blue-grey-7" v-close-popup :disable="creandoOrden" />
                  <q-btn color="primary" label="Crear orden" @click="crearOrden" :loading="creandoOrden"
                    :disable="!seleccionados.length || creandoOrden" />
                </div>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from 'src/boot/axios'
import Utils from 'src/Commons/Utils'


const Usuario = ref('')
const map = ref(null)
const marcadores = ref([])
const barriosCargados = ref(new Set())
const poligonos = ref([])
const zoomMinimoMarcadores = 13
const drawingManager = ref(null)
const seleccionando = ref(false)
const seleccionados = ref([])
const mostrarBarrios = ref(false)
const ordenDialog = ref(false)
const tecnicos = ref([])
const tecnicoSeleccionado = ref(null)
const estadosOrden = ref([
  { label: 'Pendiente por asignar', value: 1 },
  { label: 'Asignado', value: 2 }
])
const estadoOrden = ref(1)
const observaciones = ref('')
const seleccionesLuminarias = ref({})
const cargandoLuminariasId = ref(null)
const creandoOrden = ref(false)
const isUpdating = ref(false)
const fetchingBarrios = ref(new Set())
const fetchedOnce = ref(false)
const mostrarFiltroEstados = ref(false)
const modoVersiones = ref(false)
const dialogVersiones = ref(false)
const posteVersionesSeleccionado = ref(null)
// Map para reutilizar marcadores por IdPoste y no crear duplicados
const marcadoresPorPoste = new Map()

// Coordenadas iniciales (Florencia, Caquetá)
const florencia = { lat: 1.61438, lng: -75.60623 }

// 📦 Simulación temporal de barrios (puedes traerlos del backend)
const barriosEjemplo = []
const TrazarState = ref(true)
let idleListener = null
let infoWindowActual = null

// 📍 Cargar Google Maps API
async function cargarGoogleMaps() {
  return new Promise((resolve) => {
    if (window.google && window.google.maps) resolve()
    else {
      const script = document.createElement('script')
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCKZ3VPgXSiG0COYvCfpNkAWMbT0KkBkRQ&libraries=geometry,drawing'
      // 👆 eliminé "marker" porque no todos los proyectos tienen habilitada esa librería
      script.async = true
      script.defer = true
      script.onload = resolve
      document.head.appendChild(script)
    }
  })
}

// 🗺️ Dibujar polígonos (barrios)
function trazarPoligonos(barrios) {
  if (poligonos.value.length) {
    poligonos.value.forEach(p => p.setMap(null))
    poligonos.value = []
  }
  barrios.forEach((barrio, idx) => {
    const puntos = barrio.Coordenadas.split(' ').map(coord => {
      const [lng, lat] = coord.split(',').map(Number)
      return { lat, lng }
    })

    const polygon = new google.maps.Polygon({
      paths: puntos,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.05,
      map: null
    })

    const info = new google.maps.InfoWindow({ content: `<b>${barrio.Nombre}</b>` })
    polygon.addListener('click', e => { info.setPosition(e.latLng); info.open(map.value) })

    polygon.idBarrio = (barrio.IdBarrio ?? barrio.id ?? null) || (idx + 1)
    poligonos.value.push(polygon)
  })
}

// 🪧 Cargar postes (cuando el zoom >= 19)
async function cargarPostesPorBarrio(idBarrio) {
  try {
    const res = await api.get(`ordenservicio/${Usuario.value.IdEmpresa}/${idBarrio}/traer-postes-empresa`)
    return res.data
  } catch (error) {
    console.error('Error al cargar postes por barrio:', error)
    return []
  }
}

// 🧩 Crear marcadores con clustering y color por versión del poste
// Devuelve el número de versión actual (según IsActivo) o 0 si no hay información
function obtenerNumeroVersion(poste) {
  const versiones = Array.isArray(poste.Versiones) ? poste.Versiones : []
  if (!versiones.length) return 0

  // Buscar versión marcada como activa
  const activa = versiones.find(v => v.IsActivo)
  const valor =  activa?.NombreVersion 

  const num = Number(valor)
  if (!isNaN(num) && num > 0) return num

  // Si no se pudo interpretar, usamos 0 como "sin versión" para no mezclar colores
  return 0
}

function iconoPorVersion(poste) {
  const version = obtenerNumeroVersion(poste)
  console.log(version, "VERSION")
  // 0: sin versión; 1..n: colores por número de versión
  let fillColor = '#9CA3AF' // gris por defecto (sin versiones)

  if (version === 1) fillColor = '#2563EB'      // versión 1
  else if (version === 2) fillColor = '#F97316' // versión 2
  else if (version >= 3) fillColor = '#16A34A'  // versión 3 o superior

  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor,
    fillOpacity: 0.95,
    strokeColor: '#FFFFFF',
    strokeWeight: 1.5,
    scale: 6
  }
}

function crearMarcadores(postes) {
  const hadNone = marcadores.value.length === 0

  postes.forEach(p => {
    if (!p.Coordenadas) return

    const [latStr, lngStr] = p.Coordenadas.split(',').map(c => c.trim())
    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)
    if (isNaN(lat) || isNaN(lng)) return

    const id = p.IdPoste || p.id
    if (!id) return

    // Si ya existe un marcador para este poste, solo actualizamos datos e icono
    if (marcadoresPorPoste.has(id)) {
      const markerExistente = marcadoresPorPoste.get(id)
      markerExistente.data = p
      markerExistente.estadoVersion = obtenerNumeroVersion(p)
      markerExistente.setIcon(iconoPorVersion(p))
      return
    }

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map.value,
      title: p.Descripcion || 'Poste sin descripción',
      icon: iconoPorVersion(p)
    })

    marker.data = p
    marker.estadoVersion = obtenerNumeroVersion(p)

    marker.addListener('click', () => {

      // Puede venir una sola luminaria o un arreglo de luminarias
      let luminariaTexto = ''

      if (Array.isArray(p.Luminarias) && p.Luminarias.length) {
        luminariaTexto = p.Luminarias
          .map(l => l.Nombre || l.CodigoLuminaria || l.Marca || l.IdLuminaria)
          .filter(Boolean)
          .join(', ')
      } else {
        luminariaTexto = p.Luminaria || p.CodigoLuminaria || ''
      }

      const contenido = `
        <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; max-width: 260px; color:#111827;">
          <div style="font-weight:600; margin-bottom:6px;">
            ${p.Descripcion || 'Poste sin descripción'}
          </div>
          <div style="margin-bottom:2px;">
            <span style="font-weight:500;">Dirección:</span>
            <span>${p.Direccion || p.Descripcion || 'N/D'}</span>
          </div>
          <div style="margin-bottom:2px;">
            <span style="font-weight:500;">Coordenadas:</span>
            <span>${p.Coordenadas || 'N/D'}</span>
          </div>
          <div style="margin-bottom:2px;">
            <span style="font-weight:500;">Versión:</span>
            <span>${p.Versiones.find(v => v.IsActivo)?.NombreVersion || 'N/D'}</span>
          </div>
          ${luminariaTexto
          ? `<div style="margin-top:4px;">
                 <span style="font-weight:500;">Luminaria:</span>
                 <span>${luminariaTexto}</span>
               </div>`
          : ''}
        </div>
      `

      // Si el modo versiones está activo y el poste tiene historial, abrimos el diálogo
      if (modoVersiones.value && Array.isArray(p.Versiones) && p.Versiones.length) {
        posteVersionesSeleccionado.value = p
        dialogVersiones.value = true
        return
      }

      // De lo contrario, usamos el InfoWindow clásico
      if (infoWindowActual) {
        infoWindowActual.close()
      }

      infoWindowActual = new google.maps.InfoWindow({
        content: contenido
      })

      infoWindowActual.open(map.value, marker)
    })

    // Guardar en estructura de marcadores global si es nuevo
    marcadoresPorPoste.set(id, marker)
    marcadores.value.push(marker)
  })

  // Aplicar filtros actuales a los nuevos marcadores
  aplicarFiltrosEstados()

  // Ajustar zoom solo la primera vez
  // Se elimina el ajuste automático de vista para mantener el centro en Florencia
}


// 🧩 Control de zoom y visibilidad

async function actualizarPostes() {
  if (!map.value || fetchedOnce.value) return
  // No cargar postes si el zoom es muy bajo (para mejorar rendimiento)
  const zoom = map.value.getZoom()
  if (zoom < 15) return
  const bounds = map.value.getBounds()
  if (!bounds) return
  isUpdating.value = true
  try {
    const barriosVisibles = poligonos.value
      .map((polygon) => ({ polygon, id: polygon.idBarrio }))
      .filter(({ polygon }) => {
        const paths = polygon.getPath().getArray()
        return paths.some(p => bounds.contains(p))
      })
      .map(b => b.id)

    const toFetch = barriosVisibles.filter(id => id && !barriosCargados.value.has(id) && !fetchingBarrios.value.has(id))
    if (toFetch.length === 0) return

    const nextId = toFetch[0]
    fetchingBarrios.value.add(nextId)
    try {
      const postes = await cargarPostesPorBarrio(nextId)
      crearMarcadores(postes)
      barriosCargados.value.add(nextId)
    } finally {
      fetchingBarrios.value.delete(nextId)
    }
    fetchedOnce.value = true
    if (idleListener) {
      google.maps.event.removeListener(idleListener)
      idleListener = null
    }
  } finally {
    isUpdating.value = false
  }
}



function agregarSeleccion(items) {
  const existentes = new Set(seleccionados.value.map(p => p.IdPoste || p.id))
  items.forEach(p => {
    const key = p.IdPoste || p.id
    if (key && !existentes.has(key)) seleccionados.value.push(p)
  })
}

function quitarSeleccion(item) {
  const key = item?.IdPoste || item?.id
  if (!key) return
  seleccionados.value = seleccionados.value.filter(p => (p.IdPoste || p.id) !== key)
  delete seleccionesLuminarias.value[key]
}

function limpiarSeleccion() {
  seleccionados.value = []
  seleccionesLuminarias.value = {}
}

function aplicarFiltrosEstados() {
  // Actualmente no filtramos por estado; nos aseguramos de que todos los marcadores estén visibles.
  marcadores.value.forEach(marker => {
    marker.setVisible(true)
  })
}

function toggleBarrios() {
  mostrarBarrios.value = !mostrarBarrios.value
  actualizarPoligonos()
}

const abrirOrden = async () => {
  await cargarLuminarias(seleccionados.value)
  ordenDialog.value = true

}

async function cargarLuminarias(item) {
  console.log(item)
  if (!item || !item.IdPoste) return
  try {
    cargandoLuminariasId.value = item.IdPoste
    const res = await api.get('/ordenservicio/traer-luminairas-poste', item)
    item._luminarias = (res.data || []).map(l => ({ label: l.Nombre || l.id, value: l.IdLuminaria || l.id }))
  } catch (e) {
    item._luminarias = []
  } finally {
    cargandoLuminariasId.value = null
  }
}

function luminariasOptions(item) {
  return item?._luminarias || []
}

async function crearOrden() {
  try {
    creandoOrden.value = true
    const detalle = seleccionados.value.map(p => ({
      IdPoste: p.IdPoste || p.id,
      IdLuminaria: seleccionesLuminarias.value[p.IdPoste || p.id] || null
    }))
    const payload = {
      IdEmpresa: Usuario.value?.IdEmpresa,
      Tecnico: tecnicoSeleccionado.value || null,
      Estado: estadoOrden.value,
      Observaciones: observaciones.value || '',
      Detalle: detalle
    }
    await api.post('ordenservicio/crear', payload)
    ordenDialog.value = false
    limpiarSeleccion()
    Utils.notificacion('Orden creada', true)
  } catch (e) {
    Utils.notificacion('Error al crear la orden', false)
  } finally {
    creandoOrden.value = false
  }
}

const TraerBarriosCoordenadas = async () => {

  try {
    const res = await api.get(`ordenservicio/traer-barrios-coordenadas`)
    console.log(res.data)
    trazarPoligonos(res.data)
  } catch (error) {
    console.error('Error al cargar postes por barrio:', error)
    return []
  }
}


function activarSeleccionArea() {


  // TrazarState.value = false
  if (seleccionando.value) {

    drawingManager.value.setMap(null)
    seleccionando.value = false
    // TrazarState.value = true
    return
  }

  if (!TrazarState.value) return

  seleccionando.value = true

  drawingManager.value = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: false,
    polygonOptions: {
      fillColor: '#00FF00',
      fillOpacity: 0.2,
      strokeColor: '#00AA00',
      strokeWeight: 2,
      clickable: false,
      editable: false,
      zIndex: 1
    }
  })

  drawingManager.value.setMap(map.value)

  google.maps.event.addListener(drawingManager.value, 'overlaycomplete', function (event) {
    const polygon = event.overlay
    drawingManager.value.setMap(null)
    seleccionando.value = false
    const postesEnArea = marcadores.value.filter(marker =>
      marker && marker.getPosition && google.maps.geometry.poly.containsLocation(marker.getPosition(), polygon)
    )

    const nuevos = postesEnArea.map(m => m.data)
    agregarSeleccion(nuevos)
    // Utils.notificacion(`Postes seleccionados en el área: ${nuevos}`, true)
    polygon.setMap(null)
  })
}

function debounce(fn, delay = 800) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

function actualizarPoligonos() {
  // poligonos.value = []
  console.log('ejecuta')
  if (!map.value) return
  isUpdating.value = true
  try {
    poligonos.value.forEach(polygon => {
      const current = polygon.getMap()
      const target = mostrarBarrios.value ? map.value : null
      if (current !== target) polygon.setMap(target)
    })
  } finally {
    isUpdating.value = false
  }
}


const TraerTecnicos = async () => {
  try {
    const res = await api.get(`usuario/${Usuario.value.IdEmpresa}/${2}/traer-tecnicos`)
    console.log(res.data)
    tecnicos.value = res.data
  } catch (error) {
    console.error('Error al cargar tecnicos:', error)
    return []
  }
}



// // 🔔 Actualizar postes según zoom y viewport
// async function actualizarPostes() {
//   const zoom = map.value.getZoom()
//   if (zoom < zoomMinimoMarcadores) return

//   // Determinar barrios visibles (aquí debes ajustar según tu lógica)
//   const barriosVisibles = [1] // ejemplo temporal

//   for (const idBarrio of barriosVisibles) {
//     if (!barriosCargados.value.has(idBarrio)) {
//       const postes = await cargarPostesPorBarrio(idBarrio)
//       crearMarcadores(postes)
//       barriosCargados.value.add(idBarrio)
//     }
//   }
// }

// 🚀 Inicialización
onMounted(async () => {
  const user = await Utils.datoUsuario()
  Usuario.value = user

  await cargarGoogleMaps()
  await TraerTecnicos()
  map.value = new google.maps.Map(document.getElementById('map'), {
    center: florencia,
    zoom: 13,
    mapTypeId: 'roadmap',
    styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }]
  })

  map.value.setCenter(florencia)
  map.value.setZoom(13)

  // Dibujar límites de barrios
  await TraerBarriosCoordenadas()

  // Cargar postes según zoom
  // await actualizarPostes()
  // map.value.addListener('idle', actualizarPostes)
  idleListener = map.value.addListener('idle', debounce(() => {
    if (isUpdating.value) return
    actualizarPoligonos()
    actualizarPostes()
  }))
  await actualizarPostes()
})
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 90dvh;
}

.map {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.selected-panel {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 320px;
  max-width: calc(100% - 24px);
}

.controls-panel {
  position: absolute;
  top: 12px;
  right: 12px;
  max-width: calc(100% - 24px);
}

.filtros-estados-row {
  flex-wrap: wrap;
}

.estado-pill {
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 11px;
}

.custom-marker {
  font-size: 22px;
  cursor: pointer;
  transform: translate(-50%, -100%);
  transition: transform 0.2s;
}

.custom-marker:hover {
  transform: translate(-50%, -110%) scale(1.2);
}

/* ===== Diálogo de orden: estilo coherente con GestionOrdenes ===== */
.orden-dialog-card {
  max-width: 100vw;
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.orden-dialog-header {
  background: #ffffff;
  border-bottom: 1px solid #e6ebf2;
}

.orden-section-card {
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}

.orden-poste-card {
  border-radius: 10px;
}

.orden-poste-card:hover {
  box-shadow: 0 4px 10px rgba(16, 24, 40, 0.08);
}

@media (max-width: 599px) {
  .map-wrapper {
    height: 86dvh;
  }
}
</style>
