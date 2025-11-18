// import { boot } from 'quasar/wrappers'
// import axios from 'axios'
// import { Notify } from 'quasar'

// const api = axios.create({ baseURL: 'http://localhost:44368/api' })
// const api = axios.create({ baseURL: 'http://192.168.0.120/WebApiNeosage/api/' })
// const api = axios.create({ baseURL: 'http://69.28.91.194/WebApiNeosageFlorencia/api/' })
// const api = axios.create({ baseURL: 'http://69.28.91.194/WebApiNeosage/api/' })
// const api = axios.create({ baseURL: 'http://69.28.91.194/WebApiNeosageDesarrollo/api/' })

// const api = axios.create({ baseURL: 'https://alcaldia.neosage.co/WebApiNeosage/api/' })
// const api = axios.create({ baseURL: 'https://web.neosage.co/WebApiNeosageDesarrollo/api/' }) // Desarrollo y presupuestoñ
// const api = axios.create({ baseURL: 'https://web.neosage.co/WebApiNeosageNomina/api/' }) // Nomina
// const api = axios.create({ baseURL: 'https://web.neosage.co/WebApiNeosageFlorencia/api/' }) // florencia
// let token = null
// export default boot(({ app, router }) => {
//   app.config.globalProperties.$axios = axios
//   app.config.globalProperties.$api = api
//   api.defaults.headers['Content-Type'] = 'application/json'
//   // token = localStorage.getItem('tokenOneZip')
//   if (token != null) {
//     api.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(token)}`
//   }
//   api.interceptors.response.use(
//     response => response,
//     async error => {
//       if (error.response && error.response.status === 401) {
//         Notify.create({
//           type: 'negative',
//           message: `${error.response.data.Mensaje || 'Token caducado.'}`,
//           timeout: 5000
//         })
//         const usuario = localStorage.getItem("LoginNeosage")
//         usuario ? JSON.parse(usuario) : null
//         if (usuario != null) {
//           const response = await api.post('usuario/logout', usuario)
//           if (response.data.IsExito) {
//             localStorage.clear("tokenOneZip")
//             localStorage.clear("LoginNeosage")
//             localStorage.clear("EmpresaSeleccionadaOneZip")
//             router.push("/login")
//           }
//         }
//       }
//       return Promise.reject(error)
//     }
//   )
// })

// export { api, axios }

// src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Configura la URL base de tu API
const api = axios.create({ baseURL: ' http://localhost:5054/api' })
// const api = axios.create({ baseURL: 'http://192.168.0.120/WebApiTotalServis/api/' })
// const api = axios.create({ baseURL: 'http://192.168.0.120:9096/api/' })



export default boot(({ app }) => {
  // Permite usar axios globalmente con this.$axios y this.$api
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

// Exporta axios y api para usarlos en imports
export { axios, api }
