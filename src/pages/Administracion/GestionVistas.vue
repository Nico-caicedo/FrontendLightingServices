<template>
  <q-page style="height: calc(100vh - 60px); overflow: auto; background-color: #EBEBF0" class="q-pa-sm">

    <!-- Header Principal -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section class="bg-blue-grey-3 text-white q-pa-md">
        <div class="row items-center q-gutter-sm">
          <q-avatar size="56px" color="white" text-color="primary">
            <q-icon name="admin_panel_settings" size="32px" />
          </q-avatar>
          <div>
            <div class="text-h5 text-grey-9">Gestión de Vistas y Roles</div>
            <div class="text-caption text-grey-9">Administra permisos y accesos del sistema</div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Contenido Principal -->
    <div class="row q-col-gutter-md">
      <!-- Panel Izquierdo: Asignar Rol a Usuario -->
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section class="bg-blue-grey-3 text-white">
            <div class="row items-center q-gutter-sm">
              <q-icon name="person_add" color="grey-9" size="24px" />
              <div>
                <div class="text-subtitle2 text-grey-9">Asignar Rol</div>
                <div class="text-caption text-grey-9">Cambiar rol de usuario</div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md">
            <q-form @submit.prevent="guardarRolusuario" class="q-gutter-md">
              <!-- Buscador de Usuario -->
              <div>
                <div class="text-caption text-grey-9 text-grey-8 q-mb-xs">
                  Usuario
                </div>
                <q-select outlined @update:model-value="seleccionarUsuario" v-model="usuarioSeleccionado"
                  placeholder="Buscar por nombre o identificación" option-value="Idusuario"
                  option-label="NombreCompleto" :options="usuariosFiltrados" use-input @filter="filtrarusuarios"
                  clearable hide-bottom-space behavior="menu">
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-avatar color="primary" text-color="white" size="40px">
                          <q-icon name="person" />
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="text-weight-medium">{{ scope.opt.NombreCompleto }}</q-item-label>
                        <q-item-label caption>ID: {{ scope.opt.Identificacion }}</q-item-label>
                        <q-item-label caption class="text-grey-8">{{ scope.opt.Rol || 'Sin rol asignado'
                          }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey text-center">
                        <q-icon name="search_off" size="md" class="q-mb-sm" />
                        <div class="text-caption">Escribe para buscar usuarios...</div>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>

              <!-- Usuario Seleccionado -->
              <div v-if="usuarioSeleccionado?.NombreCompleto" class="q-pa-md bg-blue-1 rounded-borders">
                <div class="row items-center q-gutter-md">
                  <q-avatar color="primary" text-color="white" size="48px">
                    <q-icon name="person" size="28px" />
                  </q-avatar>
                  <div>
                    <div class="text-body2 text-grey-9">{{ usuarioSeleccionado.NombreCompleto }}</div>
                    <div class="text-caption text-grey-7">{{ usuarioSeleccionado.Identificacion }}</div>
                    <q-badge outline color="primary" class="q-mt-xs">
                      {{ usuarioSeleccionado.Rol || 'Sin rol' }}
                    </q-badge>
                  </div>
                </div>
              </div>

              <!-- Selector de Rol -->
              <div class="form-group">
                <label class="form-label">
                  Nuevo Rol
                </label>
                <q-select outlined v-model="usuarioSeleccionado.IdRol" placeholder="Seleccionar rol"
                  option-label="Nombre" option-value="IdRol" :options="roles"
                  :disable="!usuarioSeleccionado?.NombreCompleto" hide-bottom-space clearable emit-value map-options
                  behavior="menu">
                </q-select>
              </div>

              <!-- Botones de Acción -->
              <div class="row q-gutter-sm justify-end q-mt-md">
                <q-btn flat label="Cancelar" color="grey-8" @click="limpiarFormulario()" icon="close" />
                <q-btn unelevated type="submit" label="Guardar Cambios" color="primary" icon="save"
                  :disable="!usuarioSeleccionado?.NombreCompleto || !usuarioSeleccionado.IdRol" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Panel Derecho: Árbol de Vistas -->
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="bg-blue-grey-3 text-white">
            <div class="row items-center justify-between">
              <div class="row items-center q-gutter-sm">
                <q-icon name="account_tree" color="grey-9" size="24px" />
                <div>
                  <div class="text-subtitle2 text-grey-9">Configuración de Vistas</div>
                  <div class="text-caption text-grey-9">Asigna permisos de acceso por rol</div>
                </div>
              </div>
              <q-chip v-if="idRolVistas && vistas.length > 0" color="white" text-color="primary" icon="check_circle">
                {{ vistas.length }} seleccionadas
              </q-chip>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Selector de Rol para Vistas -->
          <q-card-section class="q-pa-md">
            <div>
              <div class="text-caption text-grey-9 text-grey-8 q-mb-xs">
                Seleccionar Rol para Configurar Vistas
              </div>
              <q-select outlined v-model="idRolVistas" placeholder="Elige un rol para configurar sus vistas"
                emit-value map-options option-value="IdRol" option-label="Nombre" :options="roles" clearable
                @update:model-value="traerVistasXrol" behavior="menu">
              </q-select>
            </div>
          </q-card-section>

          <!-- Árbol de Vistas -->
          <q-card-section style="min-height: 450px;">
            <!-- Estado vacío -->
            <div v-if="!idRolVistas" class="text-center q-pa-xl">
              <q-icon name="account_tree" size="80px" color="grey-4" />
              <div class="text-h6 text-grey-6 q-mt-md">Selecciona un Rol</div>
              <p class="text-body2 text-grey-6">Para configurar las vistas disponibles, primero selecciona un rol del
                menú
                superior</p>
            </div>

            <!-- Árbol cargado -->
            <div v-else-if="cargado">
              <q-scroll-area style="height: 500px;">
                <q-tree color="" :nodes="formattedMenusWithRoot" v-model:ticked="vistas" node-key="uniqueKey"
                  tick-strategy="leaf" default-expand-all class="q-pa-sm">
                  <template v-slot:default-header="prop">
                    <div class="row items-center q-gutter-xs">
                      <div class="text-grey-9"
                        :class="{ 'text-grey-9': prop.node.isRoot || prop.node.body === 'Menu' }">
                        {{ prop.node.label || "Sin nombre" }}
                      </div>
                      <q-badge v-if="prop.node.isRoot" color="primary" text-color="white">
                        Menú Principal
                      </q-badge>
                    </div>
                  </template>
                </q-tree>
              </q-scroll-area>
            </div>

            <!-- Estado de carga -->
            <div v-else class="text-center q-pa-xl">
              <q-spinner-dots color="primary" size="50px" />
              <p class="text-body2 text-grey-6 q-mt-md">Cargando vistas del sistema...</p>
            </div>
          </q-card-section>

          <q-separator />

          <!-- Acciones del Árbol -->
          <q-card-actions align="right" class="q-pa-md bg-grey-1">
            <q-btn flat label="Limpiar Selección" color="grey-8" @click="limpiarVistas()" icon="clear_all"
              :disable="!idRolVistas" />
            <q-btn unelevated :label="accionBoton" :color="colorBoton" icon="save" @click="guardarVistas()"
              :disable="!idRolVistas" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import Utils from "src/Commons/Utils";
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const $q = useQuasar();
const Empresa = ref({});
const usuario = ref({});

const usuarioSeleccionado = ref({ NombreCompleto: '', Identificacion: '', IdRol: null });
const usuariosFiltrados = ref([]);
const rolSeleccionado = ref({});
const roles = ref([]);

const idRolVistas = ref(null);
const menus = ref([]);
const vistas = ref([]);
const cargado = ref(false);


let timeoutFiltrarusuarios = null;
const seleccionarUsuario = (usuario) => {
  if (!usuario) {
    usuarioSeleccionado.value = { IdRol: null };
    return;
  }
  usuarioSeleccionado.value = usuario;
};
const filtrarusuarios = async (val, update, abort) => {
  if (val === '' || val.length < 2) {
    abort();
    usuariosFiltrados.value = [];
    return;
  }
  clearTimeout(timeoutFiltrarusuarios);
  timeoutFiltrarusuarios = setTimeout(async () => {
    try {
      const params = {
        Filtro: val,
        IdEmpresa: usuario.value.IdEmpresa
      };
      const response = await api.post('usuario/usuarios', params);
      update(() => {
        usuariosFiltrados.value = response.data || [];
      });
    } catch (error) {
      console.error('Error al filtrar usuarios:', error);
      update(() => {
        usuariosFiltrados.value = [];
      });
    }
  }, 500);
};

const guardarRolusuario = async () => {
  if (!usuarioSeleccionado.value || !rolSeleccionado.value) {
    Utils.notificacion("Por favor completa todos los campos", false);
    return;
  }

  const respuesta = await Utils.cofirmarAccion("¿Está seguro de cambiar el rol del usuario?", null);
  if (!respuesta) return;

  Utils.loadingNotify(true, 'Actualizando rol...');
  try {
    const response = await api.post("usuario/modificar", usuarioSeleccionado.value);
    Utils.notificacion(response.data.Mensaje, response.data.IsExito);
    if (response.data.IsExito) {
      limpiarFormulario();
    }
  } catch (error) {
    console.error("Error al actualizar usuario", error);
    Utils.notificacion("Error al actualizar el rol del usuario", false);
  } finally {
    Utils.loadingNotify(false);
  }
};

const limpiarFormulario = () => {
  usuarioSeleccionado.value = ''
  usuariosFiltrados.value = [];
};

// ==================== FUNCIONES ÁRBOL DE VISTAS ====================

const formatearMenusRecursiva = (menus) => {
  return menus.map(menu => {
    const vistas = (menu.Vistas || []).map(vista => ({
      label: vista.NombreVista,
      IdVista: vista.IdVista,
      body: 'Vista',
      Icon: vista.Icono,
      uniqueKey: `vista-${vista.IdVista}`
    }));

    const submenus = (menu.Menus || []).map(submenu => ({
      label: submenu.Nombre,
      body: 'Menu',
      Icon: submenu.Icono,
      uniqueKey: `menu-${submenu.IdMenu || submenu.Nombre || Math.random()}`,
      children: formatearMenusRecursiva([submenu])
    }));

    return {
      IdMenu: menu.IdMenu,
      label: menu.Nombre,
      Icon: menu.Icono,
      body: 'Menu',
      uniqueKey: `menu-${menu.IdMenu}`,
      children: [...submenus, ...vistas]
    };
  });
};

const formattedMenus = computed(() => formatearMenusRecursiva(menus.value));

// Computed con nodo raíz principal "Menú"
const formattedMenusWithRoot = computed(() => {
  if (!menus.value || menus.value.length === 0) return [];

  return [{
    label: 'Menú Principal del Sistema',
    Icon: 'dashboard',
    body: 'Root',
    isRoot: true,
    uniqueKey: 'root-menu-principal',
    children: formatearMenusRecursiva(menus.value)
  }];
});

const traerMenus = async () => {
  if (!usuario.value.IdEmpresa) return;
  Utils.loadingNotify(true, "Cargando vistas...");
  try {
    const response = await api.get(`usuario/menus/sistema`);
    menus.value = response.data;
    cargado.value = true;
    Utils.loadingNotify(false, "");
  } catch (error) {
    console.error("Error al traer el menú", error);
    Utils.loadingNotify(false, "");
  }
};

const traerVistasXrol = async (idRol) => {
  if (!idRol) {
    vistas.value = [];
    return;
  }
  Utils.loadingNotify(true, "Cargando vistas");
  try {
    const response = await api.get(`usuario/${idRol}/rol/${usuario.value.IdEmpresa}/empresa`);
    vistas.value = response.data.map((vista) => `vista-${vista.IdVista}`);
    Utils.loadingNotify(false, "");
  } catch (error) {
    console.error(error);
    Utils.loadingNotify(false, "");
  }
};

const guardarVistas = async () => {
  if (!idRolVistas.value) {
    Utils.notificacion("Por favor seleccione un Rol", false);
    return;
  }

  const mensaje = vistas.value.length === 0
    ? "¿Está seguro de guardar los Accesos seleccionados?"
    : "¿Está seguro de modificar los Accesos seleccionados?";

  const respuesta = await Utils.cofirmarAccion(mensaje, null);
  if (!respuesta) return;

  $q.loading.show();
  try {
    const idsVistas = vistas.value
      .filter(key => key.startsWith('vista-'))
      .map(key => parseInt(key.replace('vista-', '')))
      .filter(id => !isNaN(id));

    const datos = {
      IdRol: idRolVistas.value,
      Vistas: idsVistas,
      IdEmpresa: usuario.value.IdEmpresa
    };

    const response = await api.post("usuario/actualizarvistas", datos, {
      headers: { "Content-Type": "application/json" }
    });

    Utils.notificacion(response.data.Mensaje, response.data.IsExito);
    if (response.data.IsExito) {
      limpiarVistas();
    }
  } catch (error) {
    console.error("Error al actualizar las vistas", error);
    Utils.notificacion("Error al actualizar las vistas", false);
  } finally {
    $q.loading.hide();
  }
};

const limpiarVistas = () => {
  idRolVistas.value = null;
  vistas.value = [];
};

// ==================== FUNCIONES AUXILIARES ====================

const traerRoles = async () => {
  if (!usuario.value?.IdEmpresa) return;
  try {
    const response = await api.get(`usuario/rol`);
    roles.value = response.data;
  } catch (error) {
    console.error("Error al traer roles", error);
  }
};


const accionBoton = computed(() => {
  return vistas.value.length > 0 ? "Modificar" : "Guardar";
});

const colorBoton = computed(() => {
  return "primary";
});


onMounted(() => {
  Utils.datoUsuario()
    .then((response) => {
      if (response === null) {
        router.push("/login");
        return;
      }
      usuario.value = response;
      traerRoles();
      traerMenus()
    })
    .catch((error) => {
      console.log(error);
    });

});
</script>

<style scoped>
/* Estilos mínimos necesarios - Usando principalmente clases de Quasar */
</style>