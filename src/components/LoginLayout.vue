<template>
  <q-layout class="row" style="height: 100%;">
    <div v-if="isAutenticacion" class="full-height  column full-width absolute-top">
      <div class="col-6 q-pa-md">
        <h6 class="q-mt-sm text-grey-9">Bienvenido a <span class="row items-center">
            <h3 class="q-ma-none row">Neo<div class="contenedor">
                <h3 class="q-ma-none text-secundario">Sage<span>&#160;</span></h3>
              </div>
            </h3>
          </span>
        </h6>
        <h6 class="q-mb-md text-center">Elige una Empresa</h6>
        <p class="text-grey-7 text-center">Selecciona la empresa con la que deseas acceder al sistema y continuar.</p>
        <div class="row absolute-top-right q-mt-sm q-mr-sm justify-end"><q-btn icon="arrow_back"
            @click="cancelarAutenticacion" flat color="red" label="Volver" /></div>
      </div>
      <div class="gradiente aside-login col-6"></div>
      <span class="absolute-center q-gutter-sm q-pr-sm justify-center items-center row"
        style="height: 300px; width: 90vw;  overflow: auto;">
        <div class="q-pa-md bg-white justify-around column br-circle card-empresa"
          @click="seleccionarEmpresa(empre.IdEmpresa, empre.Nombre)" :key="i" v-for="(empre, i) in empresasUsuario"
          style="width: 180px; height: 220px;">
          <div class="row q-mb-xs justify-center"><q-icon :name="empre.EsCreador == 1 ? 'apartment' : 'person'"
              class="text-center" color="grey-8" size="xl" /></div>
          <div>
            <p class="q-mb-sm text-body1 text-grey-8 text-bold text-center">{{ empre.Nombre }}</p>
          </div>
          <div class="row justify-center items-center"><q-btn label="SELECCIONAR" color="grey-6" outline="" /></div>
        </div>
      </span>
    </div>
    <template v-else>
      <div :style="{ height: $q.screen.lt.md ? '160px' : 'auto' }"
        class="col-md-4 col-sm-12 col-xs-12 aside-login column q-pb-xl">
        <q-toolbar v-if="!$q.screen.lt.md">
          <h4 class="q-mt-md q-ma-none text-white"
            style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">Neosage</h4>
        </q-toolbar>
        <div class="col row justify-around items-center q-pb-xl">
          <q-carousel :style="{ height: $q.screen.lt.md ? '180px' : 'auto' }" autoplay v-model="slideLogin"
            transition-prev="scale" transition-next="scale" swipeable animated control-color="white" navigation padding
            style="background-color: transparent;">
            <q-carousel-slide v-for="(item, i) in carouselItems" :key="i" :name="item.name"
              class="item-center text-white text-body1 column no-wrap flex-center">
              <q-icon :name="item.icon" :size="$q.screen.lt.md ? '40px' : '56px'" />
              <div class="q-mt-md text-center">
                {{ item.mensaje }}
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
      <q-form :class="$q.screen.lt.md ? 'items-start' : 'items-center'" @submit.prevent="ProcesarLogin"
        class="q-pa-md col-md-8 col-sm-12 col-xs-12  row justify-center">
        <section class="row">
          <h6 class="text-grey-9 col-12">Bienvenido a <span class="row items-center">
              <h3 class="q-ma-none row">Neo<div class="contenedor">
                  <h3 class="q-ma-none text-secundario">Sage<span>&#160;</span></h3>
                </div>
              </h3>
            </span>
          </h6>
          <q-input class="q-mb-md col-12" lazy-rules bg-color="white" :rules="[Utils.regla]" outlined type="number"
            v-model="Usuario.Identificacion" label="Identificación" />
          <q-input class="col-12" lazy-rules bg-color="white" :rules="[Utils.regla]" label="Clave"
            v-model="Usuario.Clave" outlined :type="estados.isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon :name="estados.isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                @click="estados.isPwd = !estados.isPwd" />
            </template>
          </q-input>
          <div class="q-mt-xl row col-12">
            <q-btn type="submit" text-color="white" class="full-width bg-principal" label="Iniciar sesión" />
          </div>
        </section>
      </q-form>
    </template>
  </q-layout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'src/boot/axios'
import Utils from 'src/Commons/Utils'
import BaseLocal from 'src/boot/BaseLocal'

const Usuario = ref({})
const isUsuarioOffline = ref(false)
const datos = BaseLocal.iniciarBase()
const estados = reactive({ isPwd: true, BotonEnviar: false })
const router = useRouter()
const empresasUsuario = ref([])
const isAutenticacion = ref(false)
const slideLogin = ref('Actualizaciones')

const carouselItems = [
  // {
  //   name: "facturacion",
  //   icon: "receipt_long",
  //   mensaje: "Facilitamos tu facturación electrónica con seguridad y eficiencia"
  // },
  // {
  //   name: "Contabilidad",
  //   icon: "account_balance",
  //   mensaje: "Facilitamos la contabilidad de tu negocio"
  // },
  // {
  //   name: "Inventario",
  //   icon: "inventory",
  //   mensaje: "Gestiona tu inventario con precisión y tranquilidad"
  // },
  // {
  //   name: "Soporte",
  //   icon: "support",
  //   mensaje: "Soporte técnico siempre a tu disposición para cualquier necesidad"
  // },
  {
    name: "Actualizaciones",
    icon: "system_update",
    mensaje: "Actualizaciones constantes para que tu software esté siempre al día"
  }
]
const mantenerSessionDispositivo = async () => {
  const response = await api.post('usuario/cambiar-dispositivo', Usuario.value)
  if (response.data.IsExito) {
    continuarSession(response)
  } else {
    Utils.notificacion(response.data.Mensaje, response.data.IsExito)
  }
}
const continuarSession = (response) => {
  const token = response.data.Token
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  localStorage.clear("tokenOneZip")
  localStorage.clear("LoginNeosage")
  localStorage.clear("EmpresaSeleccionadaOneZip")
  localStorage.setItem('LoginNeosage', JSON.stringify(response.data.Dato))
  localStorage.setItem('tokenOneZip', JSON.stringify(response.data.Token))
  if (Usuario.value.IdEmpresa > 0 && Usuario.value.IdEmpresa) {
    localStorage.setItem("EmpresaSeleccionadaOneZip", JSON.stringify({ IdEmpresa: Usuario.value.IdEmpresa }))
  }
  Utils.loadingNotify(false, '')
  console.log(response.data.Dato.Rol);
  if (response.data.Dato.Rol === 'MAPA') {
    router.push('/principal/mapa')
  } else {
    router.push('principal')
  }
}
const ProcesarLogin = async () => {
  estados.BotonEnviar = true
  Utils.loadingNotify(true, 'Verificando usuario')
  try {
    const response = await api.post('usuario/validar', Usuario.value)
    if (response.data.Tipo == 0) {
      Utils.notificacion(response.data.Mensaje, response.data.IsExito)
    } else if (response.data.Tipo == 3) {
      Utils.loadingNotify(false, '')
      if (!(await Utils.cofirmarAccion('Ya hay una sesión activa en otra ventana. Al continuar aquí cerrará la sesión en esa ventana. ¿Desea continuar?', null))) {
        return
      }
      Usuario.value.IdUsuario = response.data.Dato
      await mantenerSessionDispositivo()
      return
    }
    if (response.data.IsExito) {
      // Usuario multiple empresa
      if (response.data.Tipo == 1) {
        isAutenticacion.value = true
        empresasUsuario.value = response.data.Dato
        Utils.loadingNotify(false, '')
        return
      }
      continuarSession(response)
    } else {
      estados.BotonEnviar = false
      Utils.loadingNotify(false, '')
    }
  } catch (error) {
    Utils.loadingNotify(false, '')
    console.error('Error al procesar el inicio de sesión:', error)
  }
}
const cancelarAutenticacion = () => {
  isAutenticacion.value = false
  Usuario.value = {}
}
const seleccionarEmpresa = async (idEmpresa, empresa) => {
  Usuario.value.IdEmpresa = idEmpresa;
  try {
    let respuesta = await Utils.obtenerRespuestaPrompt(`Ingrese la contraseña de la empresa ${empresa}`)
    respuesta = respuesta.trim()
    if (respuesta) {
      Usuario.value.Clave = respuesta
      ProcesarLogin()
    }
  } catch (error) {
    console.error(error);
  }
}
onMounted(async () => {
  Utils.loadingNotify(false)
  const usuarioResponse = await Utils.datoUsuario()
  const datosBase = await BaseLocal.obtenerDatos()

  if (datosBase && Object.keys(datosBase).length > 0) {
    const usuarioEncontrado = await datos.getItem('usuario')
    if (usuarioEncontrado != null) {
      localStorage.setItem('LoginNeosage', JSON.stringify(usuarioEncontrado))
      isUsuarioOffline.value = true
      router.push("ventas/pos")
    }
  }
  if (usuarioResponse === null) {
    router.push("/login")
    return
  } else {
    router.push("principal")
  }

})

</script>


<style scoped>
.gradiente {
  background-image: url();
  background-image: linear-gradient(to bottom, #2C2A29, #2C2A29, #2C2A29, #2C2A29, #2C2A29, #2C2A29, #2C2A29, #2C2A29, #2C2A29, #2C2A29, #2C2A29, #2C2A29);
  background-image: url('icons/wave.svg');
  background-position: center;
  background-size: cover;
  background-color: #2C2A29;
}

.card-empresa {
  cursor: pointer;
  transition: all .3s ease;
}

.card-empresa:hover {
  transform: scale(1.02);
  border: 1px solid #2C2A29;
}
</style>
