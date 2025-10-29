<template>
  <q-layout view="hHh lpR fFf" class="T-primary">
    <q-header items-align="center" class="q-pl-sm q-pr-sm row items-center"
      style="height: 55px;background-color: #2070B7; ">
      <div class="row col-md-7 col-sm-5 col-xs-7">
        <q-btn style="width: 30px;" dense flat round icon="menu" @click="cerrarMenu" />
        <!-- <span class="text-h5 row items-center justify-start q-ml-md" style="width: 240px;">
        </span> -->
        <span style="border-radius: 5px;" class="column items-start justify-center">
          <!-- <q-img style="width: 150px; height: 45px;" src="~assets/logo1.png" /> -->
           <div class="text-h6 text-weight-bold text-white q-ml-sm letter-spacing-wide">
          Lighting Services
        </div>
        </span>
      </div>
      <div class="row col-md-5 row items-center col-sm-6 col-xs-5 justify-end">

        <q-separator vertical color="white" class="q-mr-xs" inset size=".2em" />
        <q-btn dense flat size="md">
          <q-icon name="account_circle" />
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Mis perfil</div>
                <q-separator inset class="q-mb-sm bg-principal" />
                <q-btn flat="" @click="isCambiarPassword = !isCambiarPassword"><q-icon name="password"
                    class="q-mr-sm" />Cambiar
                  clave</q-btn>
                <q-btn class="q-mt-md" size="md" color="red" @click="cerrarSesion"><q-icon name="closed"
                    class="q-mr-sm " />Salir</q-btn>
              </div>
            </div>
          </q-menu>
          <q-tooltip class="text-grey-1 text-body2 bg-grey-5">Perfil</q-tooltip>
        </q-btn>
      </div>

    </q-header>



    <q-drawer bordered class="q-pa-sm q-pt-md" v-model="visibilidadMenu">

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

      <article class="column  q-mt-md q-pt-md q-pb-md items-center justify-around">
        <q-icon color="grey-7" size="lg" name="account_circle" />
        <span class="column q-mt-sm items-center justiy-center">
          <p class="text-body2 text-bold q-mb-xs text-grey-8">{{ UsuarioSesion.NombreCompleto }}</p>
          <p class="text-caption q-ma-none text-bold text-grey-8">{{ UsuarioSesion.Rol }}</p>
        </span>
  
      </article>

      <q-scroll-area class="bg-white q-mt-sm text-grey-9" style="height: calc(100% - 320px);">

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
        <q-list v-else padding>
          <MenuDinamico :items="OpcionesMenu" :idMenuActivo="idMenu" @seleccionar="mostrarComponenteMenu" />
        </q-list>
      </q-scroll-area>

      <q-separator color="grey-5" class="q-mt-xl" size="1.5px" />
      <div class="row justify-center q-mt-md items-center">
        <q-btn size="md" label="Cerrar sesión" flat @click="cerrarSesion" color="principal" icon="logout" />
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
    <q-page-container class="F-secundary absolute-bottom full-width full-height absolute-left">
      <router-view />
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
          router.push('/oficinavirtual')
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
</style>