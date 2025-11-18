<template>
  <q-layout view="lHh Lpr lFf" class="T-primary">



    <q-drawer bordered class="nav-drawer q-pa-md" v-model="visibilidadMenu" :width="280">

      <!-- <header class="row q-pr-sm justify-between"><span class="row items-center">
          <h4 class="q-ma-none row">Red<div class="contenedor">
              <h4 class="q-ma-none text-secundario">Amigos<span>&#160;</span></h4>
            </div>
          </h4>
        </span>
        <q-btn v-if="empresaSeleccionada.IsFacturacionOffline" ref="cambiarConexion" flat
          @click="isCambiarOftline = !isCambiarOftline" color="principal" :icon="modoConexion ? 'wifi' : 'wifi_off'" />
        <q-btn size="lg" dense flat round icon="close" @click="cerrarMenu" />
      </header> -->

      <section class="brand-header row items-center q-mb-sm">
        <div class="row items-center no-wrap">
          <div class="brand-icon flex flex-center">
            <q-icon name="assignment" color="white" size="28px" />
          </div>
          <div class="q-ml-sm">
            <div class="text-subtitle1 text-weight-bold text-blue-grey-10">Lighting Services</div>
           
          </div>
        </div>
        <q-space />
        <!-- <q-btn
          aria-label="Ocultar menú"
          round
          flat
          :dense="!$q.screen.lt.md"
          :size="$q.screen.lt.md ? 'lg' : 'md'"
          icon="chevron_left"
          class="brand-toggle"
          @click="cerrarMenu"
        /> -->
      </section>

      <q-separator class="q-mb-sm" />
      <div class="text-caption text-blue-grey-6 q-mb-xs letter-spacing-wide">NAVEGACIÓN</div>

      <q-scroll-area class="bg-white text-grey-9" style="height: calc(100% - 220px);">

        <template v-if="OpcionesMenu.length === 0">
          <q-item :key="i" v-for="i in 6">
            <q-item-section avatar>
              <q-skeleton size="35px" square animation="fade" />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                <q-skeleton type="text" square width="30%" animation="fade" />
                <q-skeleton type="text" square height="12px" animation="fade" />
                <q-skeleton type="text" square height="12px" width="75%" animation="fade" />
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <q-list v-else padding class="nav-list">
          <MenuDinamico :items="OpcionesMenu" :idMenuActivo="idMenu" @seleccionar="mostrarComponenteMenu" />
        </q-list>
      </q-scroll-area>

      <q-separator color="grey-4" class="q-mt-md" size="1px" />
      <div class="row justify-between items-center q-mt-sm">
        <div class="column text-blue-grey-6">
          <div class="text-caption">&nbsp;</div>
        </div>
        <q-btn size="md" label="Cerrar Sesión" flat @click="cerrarSesion" color="blue-grey-7" icon="logout" />
      </div>
    </q-drawer>

    

    <!-- Menu -->
    <main :style="{ marginLeft: $q.screen.lt.md ? '0%' : '299px' }" v-if="isVistasVisible"
      :class="!$q.screen.lt.md ? '' : 'menu-responsive'"
      class="absolute-left items-start diseno-menu justify-start bg-gris   row q-pr-md q-pt-sm">
      <div style="position: absolute; " class="row q-pl-md full-width justify-between items-center">
        <h6 class="q-ma-none text-grey-9 text-bold">{{OpcionesMenu.find(m => m.IdMenu === idMenu)?.Nombre ||
          'MÓDULO'}}
        </h6>
        <q-btn size="lg" @click="isVistasVisible = false" icon="close" flat color="grey-9" />
      </div>
      <section style="margin-top: 55px;" class="q-col-gutter-md row bg-gris full-width">
        <template v-for="(item, i) in vistas" :key="i">
          <div class="col-md-4 col-sm-6 col-xs-6" style="height: 150px;">
            <div @click="visitar(item.Ruta)" style=" position: relative;"
              class="full-width q-pb-none shadow-1 full-height card-menu bg-white column justify-center items-center">
              <q-icon color="grey-9" style="font-size: 5.5em;" :name="item.IconoVista" />
              <div class="text-center text-grey-7 text-body1 q-pa-xs full-width">
                {{ item.NombreVista }}
              </div>
            </div>
          </div>
        </template>
      </section>
    </main>

    <q-dialog v-model="isCambiarPassword">
      <q-card class="column q-pt-xl" style="width: 500px; max-width: 90%; height: 450px;">
        <div class="absolute-top-right q-mr-md q-mt-md">
          <q-btn icon="close" class="q-pa-sm" color="red" @click="isCambiarPassword = false" />
        </div>
        <q-form @submit.prevent="cambiarContraseña" class="column col q-pa-md">
          <q-input class="q-mb-md" label="Contraseña Anterior" lazy-rules :rules="[Utils.regla]" filled
            v-model="Usuario.ClaveAnterior">
            <template v-slot:prepend>
              <q-icon name="password" />
            </template>
          </q-input>
          <q-input class="q-mb-md" label="Nueva contraseña" lazy-rules :rules="[Utils.regla]" filled
            v-model="Usuario.Clave">
            <template v-slot:prepend>
              <q-icon name="password" />
            </template>
          </q-input>
          <q-input class="q-mb-md" label="Confirmar Contraseña" lazy-rules :rules="[Utils.regla]" filled
            v-model="Usuario.verifyPassword">
            <template v-slot:prepend>
              <q-icon name="password" />
            </template>
          </q-input>
          <div class="col row items-center">
            <q-btn class="full-width" type="submit" label="Confirmar cambios" color="principal  " />
          </div>
        </q-form>
      </q-card>
    </q-dialog>
    <q-page-container class="app-content">
      <div class="page-wrapper">
        <div class="page-header row items-center justify-between q-mb-md">
          <q-btn
            aria-label="Alternar menú"
            round
            flat
            :dense="!$q.screen.lt.md"
            :size="$q.screen.lt.md ? 'lg' : 'md'"
            :icon="visibilidadMenu ? 'chevron_left' : 'menu'"
            class="brand-toggle"
            @click="cerrarMenu"
          />
          <div class="row items-center"></div>
        </div>
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, resolveComponent } from "vue"
import Utils from "src/Commons/Utils"
import {  useQuasar } from "quasar"
import { api } from "src/boot/axios"
import { useRouter } from "vue-router"
import { watch } from "vue"
import MenuDinamico from "src/components/MenuDinamico.vue"

const Empresa = ref({})
const router = useRouter()
const UsuarioSesion = ref({ NombreCompleto: 'YOHANY SANTANILLA MEJIA', Rol: 'ADMIN' })
const Usuario = ref({})
const idMenu = ref(0)
const vistas = ref([])
const OpcionesMenu = ref([])
const visibilidadMenu = ref(true)
const isCambiarPassword = ref(false)
const isCambiarOftline = ref(false)
const isVistasVisible = ref(false)
const $q = useQuasar()

const cambiarContraseña = async () => {
  if (Usuario.value.verifyPassword !== Usuario.value.Clave) {
    Utils.notificacion('Las contraseñas no coinciden', false)
    return
  }
  if (!(await Utils.cofirmarAccion("Seguro de cambiar la contraseña ?", null))) {
    return
  }
  UsuarioSesion.value.ClaveAnterior = Usuario.value.ClaveAnterior
  UsuarioSesion.value.Clave = Usuario.value.Clave
  const response = await api.post("usuario/clave", UsuarioSesion.value)
  Utils.notificacion(response.data.Mensaje, response.data.IsExito)
  if (response.data.IsExito == true) {
    Usuario.value = {}
    isCambiarPassword.value = false
  }
}
const cerrarMenu = () => {
  visibilidadMenu.value = !visibilidadMenu.value
  isVistasVisible.value = false
}
const cerrarSesion = async () => {
  try {

    if (!(await Utils.cofirmarAccion("¿Seguro de cerrar sesión?", null))) {
      return
    }

    await limpiarSesion()

  } catch (error) {
    await limpiarSesion()
    Utils.notificacion(`Ocurrio un error al tratar de cerrar sesión ${error.message}`, false)
  }
}

const mostrarComponenteMenu = async (menuObjeto) => {
  idMenu.value = menuObjeto.IdMenu
  isCambiarOftline.value = false

  // Si solo hay una vista, ir directamente a esa ruta
  if (menuObjeto.Vistas && menuObjeto.Vistas.length === 1) {
    router.push(menuObjeto.Vistas[0].Ruta)
    isVistasVisible.value = false
    // visibilidadMenu.value = false
    return
  }

  // Si hay múltiples vistas, mostrar el panel de vistas
  isVistasVisible.value = true
  vistas.value = menuObjeto.Vistas
}
const visitar = async (url) => {
  router.push(url)
  isVistasVisible.value = false
}
const handleKeyPress = (event) => {
  const targetTag = event.target.tagName.toLowerCase();
  const isInputField = targetTag === 'input' || targetTag === 'textarea' || event.target.isContentEditable;

  if (isInputField) return;

  if (event.key.toLowerCase() === 'q') {
    cerrarMenu()
  }
}


onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
window.addEventListener('storage', async (event) => {
  Utils.datoUsuario()
    .then(response => {
      if (response === null) {
        Utils.notificacion("La sesión ha sido eliminada en otra ventana", null)
        setTimeout(() => {
          router.push('/ordenservicio')
        }, 3000)
        return
      }
    })
    .catch(error => {
      console.log(error)
    })
})
watch(() => $q.screen.lt.md, (isSmall) => {
  visibilidadMenu.value = false;
});
const limpiarSesion = async () => {
  localStorage.clear("tokenOneZip")
  localStorage.clear("LoginPoliweb")
  localStorage.clear("EmpresaSeleccionadaOneZip")
  router.push("/login")
}

//Link ----------------
// const urlBase = 'http://localhost:9000/#/registro';
// const urlBase = 'https://neosage.co/poliweb/#/registro';
// const urlBase = 'http://margaritamania.co/#/registro';
const urlBase = 'https://redeamigos.com/caquetadesarrollo/#/registro';

const linkGenerado = ref('');


async function encriptarDatos(idUsuario, idEmpresa) {
  const data = `${idUsuario},${idEmpresa}`
  const datosEncriptados = btoa(String(data))
  return `${urlBase}?datos=${datosEncriptados}`
}

async function generarLink() {
  const datosEncriptados = await encriptarDatos(UsuarioSesion.value.IdUsuario, UsuarioSesion.value.IdEmpresa);
  linkGenerado.value = datosEncriptados
}
function copiarLink() {
  if (!linkGenerado?.value) return;

  const texto = linkGenerado.value;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(texto)
      .then(() => $q.notify({ message: 'Link copiado', color: 'green' }))
      .catch(() => $q.notify({ message: 'Error al copiar', color: 'red' }));
  } else {
    // Fallback para entornos inseguros o navegadores antiguos
    const textArea = document.createElement("textarea");
    textArea.value = texto;
    textArea.style.position = "fixed"; // Evita scroll
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      $q.notify({
        message: successful ? 'Link copiado (fallback)' : 'Error al copiar',
        color: successful ? 'green' : 'red'
      });
    } catch (err) {
      $q.notify({ message: 'Error al copiar', color: 'red' });
    }

    document.body.removeChild(textArea);
  }
}
const traerParametros = async () => {
  const datosAlmacenados = await Utils.datosMunicipioBarrio()

  // Si ya hay datos en localStorage, salir
  if (datosAlmacenados.Municipios?.length > 0 && datosAlmacenados.Barrios?.length > 0) {
    return
  }

  try {
    const response = await api.get('usuario/direcciones')

    const municipios = response.data[0] || []
    const barrios = response.data[1] || []

    // Guardar como string en localStorage
    localStorage.setItem('Municipios', JSON.stringify(municipios))
    localStorage.setItem('Barrios', JSON.stringify(barrios))

  } catch (error) {
    console.error("Error trayendo parámetros:", error)
  }
}
const traerEmpresa = async (idEmpresa) => {

  try {
    const response = await api.get(`usuario/${idEmpresa}/empresa`)
    Empresa.value = response.data

    document.body.style.setProperty('--bg-secundario', Empresa.value.Color)

  } catch (error) {
    console.error("Error trayendo parámetros:", error)
  }
}

const traerVistas = async () => {
  const response = await api.get(`usuario/menus/${UsuarioSesion.value.IdUsuario}/usuario`)
  OpcionesMenu.value = response.data
  if(OpcionesMenu.value.length === 1){
    router.push(OpcionesMenu.value[0].Vistas[0].Ruta)
  }
}

onMounted(async () => {
  traerParametros()
  window.addEventListener('keydown', handleKeyPress)
  const usuario = await Utils.datoUsuario()

  if (!usuario) {
    router.push("/login")
    return
  }
  UsuarioSesion.value = usuario

  traerEmpresa(usuario.IdEmpresa)
  await traerVistas()
})


</script>
<style scoped>
.card-menu {
  cursor: pointer;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.card-menu:hover {
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
  transform: scale(1.02)
}

.diseno-menu {
  height: calc(100% - 125PX);
  width: 750px;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  max-width: 100vw;
  z-index: 45;
  border: 1px solid #ddd;
  top: 4em;
  overflow: auto;
}


.logo-menu {
  position: absolute;
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  bottom: 70px;
  width: 50%;
  border-top-left-radius: 1em;
  border-top-right-radius: 1em;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;

}

.clase-activa {
  background-color: #fcfafa;
}

/* ===== Drawer moderno ===== */
.nav-drawer {
  background: #ffffff;
  border-right: 1px solid #eef0f4;
}
.brand-header { padding: 8px 4px 12px 4px; }
.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2ecc71 0%, #f1c40f 100%);
  box-shadow: 0 6px 16px rgba(46, 204, 113, 0.25);
}
.letter-spacing-wide { letter-spacing: .4px; }
.nav-list {
  --nav-active-bg: rgba(46, 204, 113, 0.12);
  --nav-active-color: #1e7a3b;
  --nav-hover-bg: #f5f7fb;
}
.nav-list .q-item {
  margin: 4px 6px;
  border-radius: 12px;
  padding: 8px 10px;
  transition: background .15s ease, color .15s ease;
}
.nav-list .q-item:hover { background: var(--nav-hover-bg); }
.nav-list .q-item--active,
.nav-list .q-router-link--active,
.nav-list .q-item.q-item--active {
  position: relative;
  background: linear-gradient(90deg, var(--nav-active-bg) 0%, rgba(241, 196, 15, 0.08) 100%);
  color: var(--nav-active-color);
}
.nav-list .q-item--active .q-icon,
.nav-list .q-router-link--active .q-icon { color: var(--nav-active-color); }
.nav-list .q-item--active::before,
.nav-list .q-router-link--active::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 60%;
  background: #1e7a3b;
  border-radius: 0 12px 12px 0;
}

/* ===== Contenido ===== */
.app-content { background: #f6f8fb; }
.page-wrapper { padding: 0 12px 12px; }
@media (min-width: 768px) { .page-wrapper { padding: 0 18px 18px; } }
@media (min-width: 1280px) { .page-wrapper { padding: 0 24px 24px; } }

/* Encabezado interno con tono blanco como el menú */
.page-header {
  min-height: 56px;
  background: #ffffff;
  border: 1px solid #e6ebf2;
  border-radius: 0;
  padding: 6px 10px;
  box-shadow: 0 1px 2px rgba(16,24,40,.06);
  margin-left: -12px;
  margin-right: -12px;
}
@media (min-width: 768px) {
  .page-header { margin-left: -18px; margin-right: -18px; }
}
@media (min-width: 1280px) {
  .page-header { margin-left: -24px; margin-right: -24px; }
}
@media (max-width: 599px) {
  .page-header { border-radius: 0; padding: 4px 8px; }
}

/* Botón para alternar el drawer dentro del header */
.brand-toggle {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e6ebf2;
  color: #546e7a; /* blue-grey-7 aprox */
  box-shadow: 0 1px 2px rgba(16,24,40,.06);
}
.brand-toggle:hover { background: #f7f9fc; }

/* Marcador lateral para desktop cuando el menú está oculto */
.menu-bookmark {
  position: fixed;
  top: 88px;
  left: 0;
  width: 36px;
  height: 44px;
  background: #ffffff;
  border: 1px solid #e6ebf2;
  color: #546e7a;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  box-shadow: 0 2px 6px rgba(16,24,40,.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1800;
}
.menu-bookmark:hover { background: #f7f9fc; }
</style>