const routes = [
  {
    path: "",
    component: () => import("src/layouts/LoginLayout.vue"),
  },
  {
    path: "/login",
    component: () => import("src/layouts/LoginLayout.vue"),
  },

  {
    path: "/ordenservicio",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/ordenservicio", component: () => import("pages/IndexPage.vue") },
      {
        path: "/ordenservicio/creartramite",
        component: () => import("src/pages/Pqrs/CrearTramite.vue"),
      },
      {
        path: "/ordenservicio/asignacionordenes",
        component: () => import("src/pages/Pqrs/AsignacionOrdenes.vue"),
      },
      {
        path: "/ordenservicio/ejecucionordenes",
        component: () => import("src/pages/Pqrs/EjecucionOrden.vue"),
      },
      {
        path: "/ordenservicio/ordenvalidacion",
        component: () => import("src/pages/Pqrs/OrdenValidacion.vue"),
      },
      {
        path: "/ordenservicio/inventario",
        component: () => import("src/pages/Inventario/InventarioPage.vue"),
      },
      {
        path: "/ordenservicio/gestionordenes",
        component: () => import("src/pages/Pqrs/GestionOrdenes.vue"),
      },
    ],
  },

  {
    path: "/inventario",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/inventario",
        component: () => import("src/pages/Inventario/InventarioPage.vue"),
      },
      {
        path: "/inventario/movimientos",
        component: () => import("src/pages/Inventario/MovimientoPage.vue"),
      },
      {
        path: "/inventario/solicitudes",
        component: () => import("src/pages/Inventario/SolicitudesPages.vue"),
      },
    ],
  },
    {
    path: "/administracion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/administracion/gestionvistas",
        component: () => import("src/pages/Administracion/GestionVistas.vue"),
      },
      {
        path: "/administracion/movimientos",
        component: () => import("src/pages/Inventario/MovimientoPage.vue"),
      },
      {
        path: "/inventario/solicitudes",
        component: () => import("src/pages/Inventario/SolicitudesPages.vue"),
      },
    ],
  },

  {
    path: "/principal",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      {
        path: "/principal",
        component: () => import("src/pages/IndexPage.vue")
      }
     
    ]
  },
  //   {
  //   path: '/ordenservicio',
  //   component: () => import('pages/OrdenServicio.vue'),
  //   children: [
  //     { path: '', component: () => import('pages/IndexPage.vue') },
  //     { path: '/ordenservicio', component: () => import('pages/OrdenServicio.vue') },
  //      { path: '/gestionordenes', component: () => import('pages/GestionOrdenes.vue') }
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
