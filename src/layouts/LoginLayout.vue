<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-1">
    <!-- Encabezado -->


    <!-- Contenido -->
    <q-page-container class="row justify-center  col-12">
      <q-card class="q-pa-lg q-ma-md q-mb-none shadow-2 rounded-borders  " style="max-width: 400px; width: 90%;">
        <q-card-section align="center">
          <img src="~src/assets/logoCorporativo.png" alt="Logo" style="width: 200px; height: auto;" />

        </q-card-section>



        <q-card-section>
          <q-form @submit.prevent="login" class="q-gutter-md">
            <q-input v-model="usuario.LoginUsuario" label="Usuario" outlined lazy-rules
              :rules="[val => !!val || 'Ingrese su usuario']" />

            <q-input v-model="usuario.PasswordUsuario" label="Contraseña" outlined :type="isPwd ? 'password' : 'text'"
              lazy-rules :rules="[val => !!val || 'Ingrese su contraseña']">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>

            <q-btn type="submit" label="Ingresar" color="primary" icon="login" unelevated class="full-width" />
          </q-form>
        </q-card-section>

      </q-card>
      <div class="col-12 text-center  text-grey-7">
        © NEOSAGE {{ currentYear }}
      </div>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, LocalStorage } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import Utils from 'src/Commons/Utils'

const $q = useQuasar()
const router = useRouter()
const currentYear = new Date().getFullYear()
const isPwd = ref(true)
const usuario = ref({})

onMounted(async () => {
  const responseUsuario = await Utils.datoUsuario()
  if (responseUsuario === null) {
    router.push("/login")

    return
  } else {
    router.push("/menu")
  }
})

const login = async () => {
  try {
    Utils.loadingNotify(true, 'Procesando...')

    const response = await api.post(
      `/usuario/${usuario.value.LoginUsuario}/${usuario.value.PasswordUsuario}/autentica-usuario`
    )

    Utils.notificacion(response.data.Mensaje, response.data.IsExito)
    console.log(response.data.Dato)

    if (response.data.IsExito) {
      LocalStorage.set('usuarioLigthing', response.data.Dato)
      const value = LocalStorage.getItem('usuarioLigthing')
      if (value) router.push('/principal')
    }

  } catch (error) {
    console.error('Error al autenticar usuario:', error)

    // Muestra mensaje dependiendo del tipo de error
    if (error.response) {
      Utils.notificacion(`Error: ${error.response.data?.Mensaje || 'Error en el servidor.'}`, false)
    } else if (error.request) {
      Utils.notificacion('No se pudo conectar con el servidor. Verifica tu conexión.', false)
    } else {
      Utils.notificacion('Ocurrió un error inesperado.', false)
    }

  } finally {
    // 🔹 Esto siempre se ejecuta (éxito o error)
    Utils.loadingNotify(false, '')
  }
}


const ingresar = (datos) => {
  if (datos.ActivoUsuario === '0') {

    utils.mensaje('El usuario se encuentra inactivo, consulte con el administrador')

    salir()
    return
  }

  const fechaActual = Utils.fechaHoy()
  if (fechaActual >= convertirFecha(datos.ProximocambioUsuario)) {
    router.push('/Administracion/cambioClave')
    return
  }

  if (datos.ModpasspiUsuario === '1') {
    if (datos.NomodpassUsuario === '1') router.push('/admin')
    else router.push('/Administracion/cambioClave')
  } else {
    router.push('/admin')
  }
}

// const salir = () => {
//   $q.localStorage.remove('usuarioSILAMED')
//   $q.localStorage.remove('accesosSILAMED')
//   router.push('/')
// }

const convertirFecha = (fecha) => {
  if (!fecha) return ''
  const partes = fecha.split(/[\/\-]/)
  if (partes.length < 3) return ''
  const [dia, mes, ano] = partes
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}
</script>

<style scoped></style>
