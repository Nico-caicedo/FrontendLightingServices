<template>
  <q-layout view="lHh Lpr lFf" class="login-layout">
    <!-- Contenido principal -->
    <q-page-container class="login-container">
      <div class="row full-height no-wrap login-wrapper">
        <!-- Columna izquierda: formulario de acceso -->
        <div class="col-12 col-md-6 flex flex-center q-px-md q-py-lg login-left">
          <q-card class="login-card shadow-3 rounded-borders bg-white">
            <q-card-section class="q-pa-xl">
              <div class="column items-center q-gutter-sm q-mb-md">
                <div class="header-icon flex flex-center">
                  <q-icon name="lock" size="28px" class="text-white" />
                </div>
                <div class="title text-subtitle1 text-uppercase text-weight-bold text-grey-7">Acceso al sistema</div>
                <div class="subtitle text-h5 text-weight-bold text-blue-grey-10 text-center">
                  Bienvenido a Lighting Services
                </div>
                <div class="subtitle text-subtitle2 text-blue-grey-7 text-center">
                  Ingresa tus credenciales para continuar
                </div>
              </div>

              <q-form @submit.prevent="login" class="q-gutter-md q-mt-md">
                <q-input
                  v-model="usuario.LoginUsuario"
                  label="Correo Electrónico"
                  outlined
                >
                  <template v-slot:prepend>
                    <q-icon name="account_box" />
                  </template>
                </q-input>

                <q-input
                  v-model="usuario.PasswordUsuario"
                  label="Contraseña"
                  outlined
                  :type="isPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="[val => !!val || 'Ingrese su contraseña']"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <q-btn
                  type="submit"
                  label="Iniciar Sesión"
                 
                  unelevated
                  size="lg"
                  class="full-width q-mt-sm btn-gradient text-white no-border no-shadow"
                />
              </q-form>

              <div class="text-caption text-center q-mt-md text-blue-grey-6">
                ¿Olvidaste tu contraseña?
                <a href="#" class="recover-link">Recuperar</a>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!-- Columna derecha: información del sistema -->
        <div class="col-12 col-md-6 login-right q-pa-lg flex flex-center">
          <div class="info-panel column q-gutter-md">
            <q-card flat bordered class="info-card q-pa-lg">
              <div class="row items-center q-gutter-md">
                <div class="info-icon flex flex-center">
                  <q-icon name="lightbulb" size="32px" class="text-white" />
                </div>
                <div class="column">
                  <div class="text-subtitle2 text-uppercase text-white-7">Plataforma</div>
                  <div class="text-h6 text-weight-bold text-white">Lighting Services</div>
                </div>
              </div>
            </q-card>

            <div class="text-h5 text-weight-bold text-white q-mt-md">
              Sistema de Gestión de Servicios de Iluminación
            </div>
            <div class="text-subtitle2 text-white-7">
              Plataforma oficial para la administración, monitoreo y soporte de los servicios de iluminación.
            </div>

            <div class="q-mt-sm column q-gutter-sm">
              <div class="info-pill row items-center">
                <q-icon name="schedule" size="20px" class="q-mr-sm text-white" />
                <span class="text-body2 text-white">Gestión en línea 24/7</span>
              </div>
              <div class="info-pill row items-center">
                <q-icon name="verified_user" size="20px" class="q-mr-sm text-white" />
                <span class="text-body2 text-white">Operaciones seguras y trazables</span>
              </div>
              <div class="info-pill row items-center">
                <q-icon name="support_agent" size="20px" class="q-mr-sm text-white" />
                <span class="text-body2 text-white">Soporte técnico especializado</span>
              </div>
            </div>

            <div class="q-mt-lg">
              <q-btn
                outline
                color="white"
                label="Conocer más del sistema"
                class="info-btn"
                no-caps
              />
            </div>
          </div>
        </div>
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
    router.push("/principal")
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
    // Esto siempre se ejecuta (éxito o error)
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

<style scoped>
  .login-layout {
    background: radial-gradient(circle at top left, #f1f5f9 0%, #e2e8f0 30%, #1b5e20 90%);
  }

  .login-container {
    min-height: 100dvh;
    height: 100dvh;
  }

  .login-wrapper {
    height: 100%;
  }

  .login-left {
    background: #f5f7fa;
  }

  .login-card {
    width: 100%;
    max-width: 440px;
    padding: 24px;
    border-radius: 20px;
  }

  .header-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2ecc71 0%, #f1c40f 100%);
    box-shadow: 0 6px 16px rgba(46, 204, 113, 0.35);
  }

  .btn-gradient {
    background: linear-gradient(90deg, #2ecc71 0%, #f1c40f 100%);
    color: #fff !important;
  }

  .btn-gradient:hover {
    filter: brightness(0.97);
  }

  .recover-link {
    color: #1abc9c;
    text-decoration: none;
    font-weight: 600;
  }

  .recover-link:hover {
    text-decoration: underline;
  }

  .login-right {
    position: relative;
    color: #fff;
    background: radial-gradient(circle at top left, #2ecc71 5%, #1b5e20 60%, #0f172a 90%);
    overflow: hidden;
  }

  .login-right::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 20% 0%, rgba(241, 196, 15, 0.35), transparent 55%),
      radial-gradient(circle at 80% 100%, rgba(46, 204, 113, 0.35), transparent 55%);
    opacity: 0.9;
  }

  .info-panel {
    position: relative;
    z-index: 1;
    max-width: 520px;
  }

  .info-card {
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(12px);
  }

  .info-icon {
    width: 56px;
    height: 56px;
    border-radius: 18px;
    background: linear-gradient(135deg, #2ecc71 0%, #f1c40f 100%);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
  }

  .info-pill {
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.35);
    backdrop-filter: blur(8px);
  }

  .info-btn {
    border-radius: 999px;
    padding: 10px 22px;
    font-weight: 500;
  }

  .title,
  .subtitle {
    text-align: center;
  }

  /* Responsivo */
  @media (max-width: 1023px) {
    .login-container {
      min-height: auto;
      height: auto;
    }

    .login-wrapper {
      min-height: 100dvh;
    }

    .login-right {
      padding-top: 24px;
      padding-bottom: 32px;
    }
  }

  @media (max-width: 599px) {
    .login-card {
      padding: 16px;
    }

    .info-panel {
      text-align: left;
    }
  }
</style>
