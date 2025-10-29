<template>

  <q-layout view="hHh Lpr lff" container style="height: calc(100vh  - 70px);">

    <q-header style="height: 55px; " class="q-pl-sm bg-blue-grey-3 row items-center text-white">
      <main v-if="visibleOpciones"
        style="position: absolute; top: 0; left: 0; z-index: 99; width: 500px; height: 300px;"
        class="row q-pa-md bg-gris col-md-7 q-col-gutter-sm col-sm-12 col-xs-12">
        <div class="col-12 row justify-between ">
          <span class="text-bold text-body1 text-principal">
            Seleccionar filtros
          </span>
          <div>
            <q-btn color="principal" icon="cancel" @click="visibleOpciones = false" />
            <!-- <q-btn color="principal" label="sasas" icon="cancel" @click="procesarPDFZona" /> -->
          </div>
        </div>
        <q-select emit-value multiple clearable :options="['(Seleccionar todo)', ...filtroOpciones.Comunas]"
          class="col-md-6 col-sm-6 col-xs-12" bg-color="white" dense outlined v-model="filtro.Comunas" label="Comunas"
          @update:model-value="val => seleccionarTodo(val, 'Comunas')" />

        <q-select emit-value multiple :use-input="filtro.IsMostrar" @blur="filtro.IsMostrar = false"
          @focus="filtro.IsMostrar = true" clearable @filter="filtrarBarrios"
          :options="[{ label: '(Seleccionar todo)', value: 'all' }, ...filtroOpciones.Barrios]" v-model="filtro.Barrios"
          label="Barrios" outlined class="col-md-6 col-sm-6 col-xs-12" bg-color="white" dense
          @update:model-value="val => seleccionarTodoBarrios(val)" />

        <q-select emit-value multiple clearable :options="['(Seleccionar todo)', ...filtroOpciones.Zonas]"
          class="col-md-6 col-sm-6 col-xs-12" bg-color="white" dense outlined v-model="filtro.Zonas" label="Zonas"
          @update:model-value="val => seleccionarTodo(val, 'Zonas')" />

        <q-select emit-value multiple clearable :options="['(Seleccionar todo)', ...filtroOpciones.Destinos]"
          class="col-md-6 col-sm-6 col-xs-12" bg-color="white" dense outlined v-model="filtro.Destinos" label="Destinos"
          @update:model-value="val => seleccionarTodo(val, 'Destinos')" />

        <q-select emit-value multiple clearable :options="['(Seleccionar todo)', ...filtroOpciones.Estratos]"
          class="col-md-6 col-sm-6 col-xs-12" bg-color="white" dense outlined v-model="filtro.Estratos" label="Estratos"
          @update:model-value="val => seleccionarTodo(val, 'Estratos')" />

        <q-select emit-value multiple clearable :options="['(Seleccionar todo)', ...filtroOpciones.Condiciones]"
          class="col-md-6 col-sm-6 col-xs-12" bg-color="white" dense outlined v-model="filtro.Condiciones"
          label="Condiciones" @update:model-value="val => seleccionarTodo(val, 'Condiciones')" />
        <div>
          <q-btn icon="search" @click="generarMapaConFiltro" color="secundario" />
        </div>
      </main>
      <div class="col-12 row justify-between">
        <span class="self-start">
          <q-btn color="gris" text-color="grey-9" icon="filter_alt" @click="visibleOpciones = true" />
        </span>
        <div>
          <q-input type="text" outlined dense bg-color="white" style="width: 450px;" label="Filtro avanzado"
            v-model="filtroAI" @keyup.enter="procesarMensaje">
            <template v-slot:prepend>
              <q-icon name="model_training" />
            </template>
          </q-input>
        </div>
        <span class="row q-gutter-sm">

          <q-btn color="white" text-color="grey-9" icon="route" @click="isMostrarOpcionesRuta = true">
          </q-btn>
          <q-btn color="white" text-color="grey-9" icon="download" @click="guardarInformacion">
            <q-badge floating>{{ datosEncontrados.length }}</q-badge>
          </q-btn>
          <q-btn color="secundario" icon="more_vert">
            <q-menu>
              <q-list style="min-width: 200px">

                <q-item clickable v-ripple @click="isCrearRangosMapa = true">
                  <q-item-section avatar>
                    <q-icon name="description" color="blue" />
                  </q-item-section>
                  <q-item-section>Crear rango impuesto </q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="consolidarFiltroActual">
                  <q-item-section avatar>
                    <q-icon name="list_alt" color="secundario" />
                  </q-item-section>
                  <q-item-section>Ver detalle</q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="abrirGraficos('valor')">
                  <q-item-section avatar>
                    <q-icon name="monetization_on" color="secondary" />
                  </q-item-section>
                  <q-item-section>Valores</q-item-section>
                </q-item>

                <q-item clickable v-ripple @click="abrirBuscarPredio">
                  <q-item-section avatar>
                    <q-icon name="search" color="secondary" />
                  </q-item-section>
                  <q-item-section>Buscar</q-item-section>
                </q-item>

              </q-list>
            </q-menu>
          </q-btn>
          <q-btn color="white" text-color="grey-9" icon="refresh" @click="generarMapaConFiltro" />
          <q-btn color="white" text-color="grey-9" icon="crop" @click="activarDibujo" />
          <q-btn text-color="grey-9" label="Seleccionados" color="white" icon="search" @click="filtrarPrediosEnArea" />
        </span>
      </div>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :width="350" :breakpoint="500" bordered class="bg-white">

      <header class="column q-pt-lg q-pb-lg justify-center items-start q-pa-sm q-pl-md full-width">
        <p class="q-ma-none text-grey-9 q-mb-xs text-weight-bold text-h5 text-center">Graficos </p>
        <p class="q-ma-none q-mb-sm text-body1 text-grey-8">Filtros adicionales</p>
        <q-btn-toggle @update:model-value="renderizarMapaConfiltro" v-model="filtro.Tipo" spread no-caps
          toggle-color="principal" color="white" text-color="black" :options="[
            { label: 'Pagos', value: 1 },
            { label: 'Avaluo', value: 2 },
            { label: 'Impuesto', value: 3 }
          ]" />
        <div class="row">
          <q-checkbox v-model="filtro.IsExcluido" val="orange" label="Excluido" color="principal" />
          <q-checkbox v-model="filtro.IsExcento" val="red" label="Exento" color="principal" />
          <q-checkbox v-model="filtro.IsProceso" val="red" label="En Proceso" color="principal" />
        </div>

      </header>
      <q-separator size="1px" />

      <div id="graficoPastel" class="q-ml-sm q-mt-md" style="width: 90%; height: 300px;"></div>

    </q-drawer>

    <q-page-container>
      <q-page>
        <span class="row">
          <section class="col-12">

            <div id="map" style="width: 100%; height: calc(100vh - 280px);"></div>

            <footer v-if="filtro.Tipo === 1" style="height: 150px;" class="row items-center justify-evenly">
              <span>
                <q-btn flat>
                  <q-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item @click="verDetalleXRango(0, 99999999999999)" clickable v-close-popup>
                        <q-item-section>Ver detalle</q-item-section>
                      </q-item>
                      <q-item @click="mostrarEnMapa(0, 99999999999999)" clickable v-close-popup>
                        <q-item-section>Mostrar en mapa</q-item-section>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </q-menu>
                  <span class="column q-pt-sm">
                    <p class="q-ma-none text-body1 q-mb-sm">Personas que han pagado</p>
                    <h4 class="q-ma-none cursor-pointer text-blue">{{(zonas
                      ||
                      []).filter(z =>
                        z.IsPago).length}} -
                      {{((zonas || []).filter(z => z.IsPago).length / (zonas || []).length * 100).toFixed(1)}}%</h4>
                    <h5 class="q-ma-none  text-blue">
                      {{redondearNumeroAMillones(
                        zonas
                          .filter(z => z.IsPago)
                          .reduce((suma, z) => suma + (z.Valor || 0), 0)
                      )}}
                    </h5>
                  </span>
                </q-btn>

              </span>
              <span>
                <q-btn flat>
                  <q-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item @click="verDetalleXRango(0, 99999999999999)" clickable v-close-popup>
                        <q-item-section>Ver detalle</q-item-section>
                      </q-item>
                      <q-item @click="mostrarEnMapa(0, 99999999999999)" clickable v-close-popup>
                        <q-item-section>Mostrar en mapa</q-item-section>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </q-menu>
                  <span class="column q-pt-sm">
                    <p class="q-ma-none text-body1 q-mb-sm">Personas que no han pagado</p>
                    <h4 class="q-ma-none cursor-pointer  text-red">{{(zonas
                      ||
                      []).filter(z =>
                        !z.IsPago).length}} -
                      {{((zonas || []).filter(z => !z.IsPago).length / (zonas || []).length * 100).toFixed(1)}}%</h4>
                    <h5 class="q-ma-none text-red">
                      {{redondearNumeroAMillones(
                        zonas
                          .filter(z => !z.IsPago)
                          .reduce((suma, z) => suma + (z.Valor || 0), 0)
                      )}}
                    </h5>
                  </span>
                </q-btn>
              </span>
            </footer>
            <footer v-else-if="filtro.Tipo != 1" style="height: 150px;" class="row items-center justify-evenly">
              <template v-for="(item, i) in construirCantidadXRango(zonas)" :key="i">
                <span>
                  <p class="q-ma-none text-body1 q-mb-sm">{{ item.Nombre }}</p>
                  <h4 :style="{ color: item.Color }" class="q-ma-none">{{ item.Valor }}</h4>
                  <q-btn flat>
                    <q-menu>
                      <q-list dense style="min-width: 100px">
                        <q-item @click="verDetalleXRango(item.min, item.max)" clickable v-close-popup>
                          <q-item-section>Ver detalle</q-item-section>
                        </q-item>
                        <q-item @click="mostrarEnMapa(item.min, item.max)" clickable v-close-popup>
                          <q-item-section>Mostrar en mapa</q-item-section>
                        </q-item>
                        <q-separator />
                      </q-list>
                    </q-menu>
                    <span class="column q-pt-sm">
                      <h4 :style="{ color: item.Color }" class="cursor-pointer q-ma-none"> {{ item.Cantidad }}</h4>
                      <p :style="{ color: item.Color }" class="q-ma-none"> {{
                        Utils.formatoMonedaNumero(item.Porcentaje, 1) }}%</p>
                      <h4 :style="{ color: item.Color }" class="q-ma-none text-body1 text-blue">${{
                        redondearNumeroAMillones(item.ValorPagaron) }}</h4>
                      <h4 :style="{ color: item.Color }" class="q-ma-none text-body1 text-red">${{
                        redondearNumeroAMillones(item.ValorNPagaron) }}</h4>
                    </span>
                  </q-btn>

                </span>
              </template>
            </footer>
          </section>
        </span>
      </q-page>
    </q-page-container>

    <q-dialog full-height full-width v-model="isVerPredios" backdrop-filter="brightness(60%)">
      <q-card style="width: 950px; max-width: 90vw; height: 500px; border-radius: 1em;">
        <header class="bg-white q-mb-md" style="height: 45px;">
          <span class="items-center justify-between q-pa-md row">
            <h6 class="q-ma-none q-ml-xs text-grey-8">Predios</h6>
            <q-btn flat @click="cerrarVentana" class="absolute-top-right q-ma-md" icon="cancel" color="grey-7" />
          </span>
        </header>

        <section cl ass="column full-height">
          <q-tabs v-model="tab" class="text-grey-8" active-color="secundario" indicator-color="secundario" align="left">
            <q-tab name="acumulado" label="Acumulado" />
            <q-tab name="detalle" label="Detalle" />
          </q-tabs>

          <q-separator />


          <q-tab-panels v-model="tab" animated class="q-pa-md">

            <q-tab-panel name="acumulado">

              <q-table :columns="columnaFiltro" :rows="prediosAcumulado" class="col" flat bordered>
                <template v-slot:top-right>
                  <q-btn @click="generarExcel(prediosAcumulado, columnaFiltro, 'Reporte_Acumulado')"
                    label="Exportar a Excel" color="secundario" />
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                      <template v-if="col.name === 'Pagaron'">
                        <div class="text-bold">{{ props.row.Pagaron }} - <q-badge class="q-pa-xs" color="grey-8">{{
                          props.row.PPagaron }}%</q-badge></div>
                      </template>
                      <template v-else-if="col.name === 'NPagaron'">
                        <div class="text-bold">{{ props.row.NPagaron }} - <q-badge class="q-pa-xs" color="grey-8"> {{
                          props.row.PNPagaron }}%</q-badge></div>
                      </template>
                      <template v-else-if="col.name === 'Acciones'">
                        <q-btn color="secundario" icon="visibility" dense @click="verDetalle(props.row.IsPago)" />
                      </template>
                      <template v-else>
                        {{ col.value }}
                      </template>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>

            </q-tab-panel>

            <q-tab-panel name="detalle">

              <q-table :columns="columnas" :rows="prediosDetalle" class="col" flat bordered>
                <template v-slot:top-right>
                  <q-btn @click="generarExcel(prediosDetalle, 'Reporte_Detalle')" label="Exportar a Excel"
                    color="secundario" />
                </template>
              </q-table>
            </q-tab-panel>

          </q-tab-panels>
        </section>
      </q-card>
    </q-dialog>

    <q-dialog full-height full-width v-model="isVerPrediosRango" backdrop-filter="brightness(60%)">
      <q-card style="width: 950px; max-width: 90vw; height: 500px; border-radius: 1em;">
        <header class="bg-white q-mb-md" style="height: 45px;">
          <span class="items-center justify-between q-pa-md row">
            <h6 class="q-ma-none q-ml-xs text-grey-8">Predios</h6>
            <q-btn flat @click="isVerPrediosRango = false" class="absolute-top-right q-ma-md" icon="cancel"
              color="grey-7" />
          </span>
        </header>

        <section cl ass="column full-height">
          <q-tabs v-model="tab1" class="text-grey-8" active-color="secundario" indicator-color="secundario"
            align="left">
            <q-tab name="acumulado" label="Acumulado" />
            <q-tab name="detalle" label="Detalle" />
          </q-tabs>

          <q-separator />


          <q-tab-panels v-model="tab1" animated class="q-pa-md">

            <q-tab-panel name="acumulado">

              <q-table :columns="columnaFiltro" :rows="prediosAcumuladoRango" class="col" flat bordered>
                <template v-slot:top-right>
                  <q-btn @click="generarExcel(prediosAcumuladoRango, columnaFiltro, 'Reporte_Acumulado')"
                    label="Exportar a Excel" color="secundario" />
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                      <template v-if="col.name === 'Pagaron'">
                        <div class="text-bold">{{ props.row.Pagaron }} - <q-badge class="q-pa-xs" color="grey-8"> {{
                          props.row.PPagaron }}%</q-badge></div>
                      </template>
                      <template v-else-if="col.name === 'NPagaron'">
                        <div class="text-bold">{{ props.row.NPagaron }} - <q-badge class="q-pa-xs" color="grey-8">{{
                          props.row.PNPagaron }}%</q-badge></div>
                      </template>
                      <template v-else-if="col.name === 'Acciones'">
                        <q-btn color="secundario" icon="visibility" dense
                          @click="verDetalleAcumulado(props.row.min, props.row.max, props.row.IsPago)" />
                      </template>
                      <template v-else>
                        {{ col.value }}
                      </template>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>

            </q-tab-panel>

            <q-tab-panel name="detalle">

              <q-table :columns="columnas" :rows="prediosDetalleRango" class="col" flat bordered>
                <template v-slot:top-right>
                  <q-btn @click="generarExcel(prediosDetalleRango, columnas, 'Reporte_Detalle')"
                    label="Exportar a Excel" color="secundario" />
                </template>
              </q-table>
            </q-tab-panel>

          </q-tab-panels>
        </section>
      </q-card>
    </q-dialog>

    <q-dialog full-height full-width v-model="isVerbuscarPredio" backdrop-filter="brightness(60%)">
      <q-card style="width: 950px; max-width: 90vw; height: 500px; border-radius: 1em;">
        <header class="bg-white q-mb-md" style="height: 100px;">
          <span class="items-center justify-between q-pa-md row">
            <h6 class="q-ma-none q-ml-xs text-grey-8">Buscar predio por propietario identificacion</h6>
            <q-btn flat @click="isVerbuscarPredio = false" class="absolute-top-right q-ma-md" icon="cancel"
              color="grey-7" />
            <q-input v-model="filtro.Texto" bg-color="gris" label="Buscar predio" outlined class="q-mt-sm col-12"
              @keyup.enter="buscarPrediosXNombre" />
          </span>
        </header>

        <q-table selection="multiple" row-key="IdPredio" v-model:selected="selected" :columns="columnas"
          :rows="prediosFiltrados" class="col" flat bordered>
          <template v-slot:top-right>
            <q-btn @click="generarExcel(prediosFiltrados, columnas, 'Filtros_predio')" label="Exportar a Excel"
              color="secundario" />
          </template>
          <template v-slot:top-left>
            <q-btn @click="seleccionarFilaMultiple(selected)" icon="search" label="Mostrar en mapa" color="principal" />
          </template>
        </q-table>
      </q-card>
    </q-dialog>

    <q-dialog full-height full-width v-model="isVerDetalle" backdrop-filter="brightness(60%)">
      <q-card style="width: 950px; max-width: 90vw; height: 500px; border-radius: 1em;">
        <header class="bg-white q-mb-md " style="height: 45px;">
          <span class="items-center justify-between q-pa-md row">
            <h6 class="q-ma-none q-ml-xs text-grey-8">Detalles del filtro</h6>
            <q-btn flat @click="isVerDetalle = false" class="absolute-top-right q-ma-md" icon="cancel" color="grey-7" />
          </span>
        </header>
        <section class="row q-pa-md">
          <main class="full-width row q-pt-md q-pl-md q-pb-md br-circle">

            <div class="row q-mb-md text-grey-6 col-12 q-col-gutter-md">

              <span class="col">
                <h5 class="q-ma-none col-12 text-body1 text-grey-7 text-bold">Detalle del filtro aplicado</h5>
              </span>

            </div>
            <main class="row col-12 q-col-gutter-md">

              <div class="row items-center col-12">

                <q-table :columns="columnasConsolidado" :rows="detalleConsolidado" class="col" flat bordered>
                  <template v-slot:top-right>
                    <q-btn @click="generarExcel(detalleConsolidado, columnasConsolidado, 'Consolidado documento')"
                      label="Exportar a Excel" color="secundario" />
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        <template v-if="col.name === 'Pagaron'">
                          <div class="text-bold">{{ props.row.Pagaron }} - <q-badge class="q-pa-xs" color="grey-8"> {{
                            props.row.PPagaron }}%</q-badge></div>
                        </template>
                        <template v-else-if="col.name === 'NPagaron'">
                          <div class="text-bold">{{ props.row.NPagaron }} - <q-badge class="q-pa-xs" color="grey-8">
                              {{
                                props.row.PNPagaron }}%</q-badge></div>
                        </template>
                        <template v-else-if="col.name === 'Acciones'">
                          <q-btn color="secundario" icon="visibility" dense @click="verDetalle(props.row.IsPago)" />
                        </template>
                        <template v-else>
                          {{ col.value }}
                        </template>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
            </main>
          </main>
        </section>
      </q-card>
    </q-dialog>

    <q-dialog full-height full-width v-model="isVerGraficos" @show="abrirGraficos()"
      @hide="() => { grafico?.destroy(); grafico = null }">

      <q-card style="width: 950px; max-width: 90vw; height: 500px; border-radius: 1em;">
        <header class="bg-white q-mb-md " style="height: 45px;">
          <span class="items-center justify-between q-pa-md row">
            <h6 class="q-ma-none q-ml-xs text-grey-8">Graficos</h6>
            <q-btn flat @click="isVerGraficos = false" class="absolute-top-right q-ma-md" icon="cancel"
              color="grey-7" />
          </span>
        </header>
        <section class="row q-pa-md">
          <main class="full-width row q-pt-md q-pl-md q-pb-md br-circle">

            <div class="row q-mb-md text-grey-6 col-12 q-col-gutter-md">

              <span class="col">
                <h5 class="q-ma-none col-12 text-body1 text-grey-7 text-bold">Detalle del filtro aplicado</h5>
              </span>

            </div>
            <main class="row col-12 q-col-gutter-md">

              <div class="row items-center col-12">
                <div id="grafico" style="width: 100%; height: 500px;"></div>
                <!-- <div id="grafico" style="width: 100%; height: 400px;"></div> -->
              </div>
            </main>
          </main>
        </section>
      </q-card>
    </q-dialog>

    <q-dialog full-height full-width v-model="isverGraficoXRango" @show="abrirGraficosRango()"
      @hide="() => { graficoRango?.destroy(); graficoRango = null }">

      <q-card style="width: 950px; max-width: 90vw; height: 500px; border-radius: 1em;">
        <header class="bg-white q-mb-md " style="height: 45px;">
          <span class="items-center justify-between q-pa-md row">
            <h6 class="q-ma-none q-ml-xs text-grey-8">Graficos</h6>
            <q-btn flat @click="isverGraficoXRango = false" class="absolute-top-right q-ma-md" icon="cancel"
              color="grey-7" />
          </span>
        </header>
        <section class="row q-pa-md">
          <main class="full-width row q-pt-md q-pl-md q-pb-md br-circle">

            <div class="row q-mb-md text-grey-6 col-12 q-col-gutter-md">

              <span class="col">
                <h5 class="q-ma-none col-12 text-body1 text-grey-7 text-bold">Detalle del filtro aplicado</h5>
              </span>

            </div>
            <main class="row col-12 q-col-gutter-md">

              <div class="row items-center col-12">
                <div id="GraficoRango" style="width: 100%; height: 500px;"></div>
                <!-- <div id="grafico" style="width: 100%; height: 400px;"></div> -->
              </div>
            </main>
          </main>
        </section>
      </q-card>
    </q-dialog>


    <q-dialog v-model="isCrearRangosMapa" backdrop-filter="brightness(60%)">
      <q-card class="column no-wrap bg-white" style="width: 900px; max-width: 90vw; height: 800px;">

        <q-toolbar class="bg-blue-grey-9 text-white">
          <q-toolbar-title>
            Crear rango impuesto
          </q-toolbar-title>
          <q-btn flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>

        <div class="row q-pa-sm">

          <q-btn-toggle v-model="rango.Tipo" spread no-caps toggle-color="principal" class="q-mb-sm" color="white"
            text-color="black" :options="[
              { label: 'Impuesto', value: 1 },
              { label: 'Avaluo', value: 2 }
            ]" />

          <q-form class="col-12 row q-col-gutter-sm" @submit.prevent="guardarRango">
            <q-input v-model="rango.Minimo" outlined :rules="[Utils.regla]" class="col-md-6 col-sm-6 col-xs-12"
              label="Minimo" type="number" />
            <q-input v-model="rango.Maximo" outlined :rules="[Utils.regla]" class="col-md-6 col-sm-6 col-xs-12"
              label="Maximo" type="number" />
            <div class="row col-md-12 justify-center items-center">
              <q-input v-model="rango.Color" type="color" outlined class="col-md-6 col-sm-6 col-xs-12" label="Color" />
              <q-badge class="col q-pa-sm q-ml-sm" :style="{ backgroundColor: rango.Color }" label="Vista previa"
                text-color="white" />
            </div>
            <div class="row col-md-6 justify-center items-center q-mt-md">
              <q-btn label="Guardar rango" style="width: 200px;" class="text-white bg-secundario" type="submit" />
            </div>
            <div class="row col-md-6 justify-center items-center q-mt-md">
              <q-btn label="Mostrar en mapa" @click="mostrarEnMapaZonas" style="width: 200px;"
                class="text-white bg-principal" type="button" />
            </div>

            <q-table style="height: 400px" class="col-12" flat
              :rows="rango.Tipo === 2 ? RANGOS_AVALUO : RANGOS_IMPUESTO" :columns="columns">
              <template v-slot:body-cell-acciones="props">
                <q-td :props="props">
                  <q-btn flat round dense color="negative" icon="delete" @click="eliminarFila(props.row)" />
                </q-td>
              </template>
              <template v-slot:body-cell-color="props">
                <q-td :props="props">
                  <q-badge class="col q-pa-sm q-ml-sm" :style="{ backgroundColor: props.row.color }"
                    :label="props.row.color" text-color="white" />
                </q-td>
              </template>
            </q-table>


          </q-form>
        </div>
      </q-card>

    </q-dialog>


    <q-dialog maximized v-model="isMostrarOpcionesRuta">
      <q-card class="" style="width: 80vw; height: 700px;">
        <q-toolbar class="bg-principal text-white">
          <q-toolbar-title>
            Seleccionar carpeta
          </q-toolbar-title>
          <q-btn flat icon="close" v-close-popup></q-btn>
        </q-toolbar>
        <div class="row q-pa-md">

          <div style="height: 520px; overflow-y: auto;  " class="col-md-8 row justify-left items-center">
            <div>
              <q-tree color="principal" default-expand-all :nodes="lineasPoligonosAgrupadasArbol" tick-strategy="leaf" node-key="id"
                v-model:ticked="tickedPoligonos">
                <template v-slot:default-header="prop">
                  <div class="row items-center q-gutter-sm">
                    <div class="ellipsis text-black text-weight-medium" style="max-width:200px">
                      <q-badge :style="{ backgroundColor: coloresRango.find(c => c.id === prop.node.id)?.color }"></q-badge>
                      {{ prop.node.label }}
                      <q-tooltip>{{ prop.node.label }}</q-tooltip>
                    </div>
                  </div>
                </template>
              </q-tree>
            </div>
          </div>

          <div class="col-md-4 row justify-center items-center">
            <div v-if="carpetasSeleccionadas.length === 1">
              <q-input type="color" v-model="colorSeleccionado" format-model="hex" style="width: 400px;" />
              <div class="q-mt-md">
                <q-btn color="principal" label="Guardar color" @click="guardarCambioColor" />
              </div>
            </div>
            <template v-else>
              <div class="text-center" style="width: 400px; height: 520px">
                <q-icon name="info" color="grey-5" size="24px" />
                <div class="text-grey-5">No hay carpetas seleccionadas</div>

              </div>
            </template>
          </div>

        </div>

        <q-separator />
        <div class="q-pa-sm text-center">
          <div>
            <q-btn icon="refresh" color="principal" label="Mostrar en mapa" @click="renderizarLineaRutasCompleta" />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, watch, ref } from 'vue'
import { api } from 'src/boot/axios'
import Utils from 'src/Commons/Utils'
import { Notify } from 'quasar'
import { Column, Pie } from '@antv/g2plot'
import { nextTick, computed } from 'vue'
import localforage from 'localforage'
import * as XLSX from 'xlsx'

const lineasPoligonos = ref([])
const lineasPoligonosAgrupadasArbol = ref([])
const tickedPoligonos = ref([])
const coloresRango = ref([])
const colorSeleccionado = ref('#000000')

const selected = ref([])
const rango = ref({ Tipo: 1 })
const rangosMostrar = ref([])
const datosEncontrados = ref([])
const isCrearRangosMapa = ref(false)
const isMostrarOpcionesRuta = ref(false)
const visibleOpciones = ref(false)
const isInformacionDescargada = ref(false)
const isVerDetalle = ref(false)
let grafico = null
let graficoRango = null
let graficoPastel = null
const isVerGraficos = ref(false)
const isverGraficoXRango = ref(false)
const isVerPredios = ref(false)
const isVerPrediosRango = ref(false)
const isVerbuscarPredio = ref(false)
const drawer = ref(true)
const prediosSeleccionados = ref([])
const prediosFiltrados = ref([])
const prediosAcumulado = ref([])
const prediosAcumuladoRango = ref([])
const prediosDetalleRango = ref([])
const prediosDetalle = ref([])
const zonas = ref([])
const zonasBase = ref([])
const detalleConsolidado = ref([])
const poligonosPorFicha = new Map()
const detalleConsolidadoPastel = ref([])
const filtro = ref({ Tipo: 1, IsExcento: false, IsExcluido: false, IsProceso: false })
const tab = ref('')
const tab1 = ref('')
let map
let drawingManager
let areaSeleccionada = null
const tamanoBloque = 10000
const filtroOpciones = ref({ Comunas: [], Barrios: [], Zonas: [], Condiciones: [], Destinos: [], Estratos: [] })
let poligonosDibujados = []
let columnas = [
  { sortable: true, label: 'Ficha Final', field: 'FichaFinal', align: 'left', name: 'FichaFinal' },
  { sortable: true, label: 'Pagado', field: 'IsPago', align: 'left', name: 'IsPago' },
  { sortable: true, label: 'En proceso', field: 'IsProceso', align: 'left', name: 'IsProceso' },
  { sortable: true, label: 'Contribuyente', field: 'Contribuyente', align: 'left', name: 'Contribuyente' },
  { sortable: true, label: 'Identificación', field: 'Identificacion', align: 'left', name: 'Identificacion' },
  { sortable: true, label: 'Dirección', field: 'Direccion', align: 'left', name: 'Direccion' },
  { sortable: true, label: 'Barrio', field: 'Barrio', align: 'left', name: 'Barrio' },
  { sortable: true, label: 'Comuna', field: 'Comuna', align: 'left', name: 'Comuna' },
  { sortable: true, label: 'Zona', field: 'Zona', align: 'left', name: 'Zona' },
  { sortable: true, label: 'Condición', field: 'Condicion', align: 'left', name: 'Condicion' },
  { sortable: true, label: 'Avalúo', field: 'Avaluo', align: 'left', name: 'Avaluo', format: val => `${Utils.formatoMoneda(val, 2)}` },
  { sortable: true, label: 'Área', field: 'Area', align: 'left', name: 'Area' },
  { sortable: true, label: 'Hectáreas', field: 'Hectareas', align: 'left', name: 'Hectareas' },
  { sortable: true, label: 'Área Construida', field: 'AreaConstruida', align: 'left', name: 'AreaConstruida' },
  { sortable: true, label: 'Valor', field: 'Valor', align: 'left', name: 'Valor', format: val => `${Utils.formatoMoneda(val, 2)}` },
  { sortable: true, label: 'VigMinima', field: 'VigMinima', align: 'left', name: 'VigMinima' },
  { sortable: true, label: 'VigMaxima', field: 'VigMaxima', align: 'left', name: 'VigMaxima' },
  { sortable: true, label: 'ValorAnterior', field: 'ValorAnterior', align: 'left', name: 'ValorAnterior', format: val => `${Utils.formatoMoneda(val, 2)}` },
  { sortable: true, label: 'Correo', field: 'Correo', align: 'left', name: 'Correo' },
  { sortable: true, label: 'Telefono', field: 'Telefono', align: 'left', name: 'Telefono' }
]
const columns = [
  { name: 'key', label: 'key', field: 'key', align: 'left' },
  { name: 'min', label: 'Mínimo', field: 'min', align: 'right', format: val => `${Utils.formatoMoneda(val, 2)}` },
  { name: 'max', label: 'Máximo', field: 'max', align: 'right', format: val => `${Utils.formatoMoneda(val, 2)}` },
  { name: 'color', label: 'Color', field: 'color', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]
const puntosMapa = ref([])
let columnasConsolidado = [
  { sortable: true, label: 'Campo', field: 'Campo', align: 'left', name: 'Campo' },
  { sortable: true, label: 'Pagaron', field: 'Pagaron', align: 'left', name: 'Pagaron' },
  { sortable: true, label: 'No Pagaron', field: 'NPagaron', align: 'left', name: 'NPagaron' },
  { sortable: true, label: 'Valor Pagado', field: 'ValorPagado', align: 'left', name: 'ValorPagado', format: val => `${Utils.formatoMoneda(val, 2)}` },
  { sortable: true, label: 'Valor No Pagaron', field: 'ValorNoPagaron', align: 'left', name: 'ValorNoPagaron', format: val => `${Utils.formatoMoneda(val, 2)}` },
]
let columnaFiltro = [
  { sortable: true, label: 'Pagaron', field: 'Pagaron', align: 'left', name: 'Pagaron' },
  { sortable: true, label: 'NPagaron', field: 'NPagaron', align: 'left', name: 'NPagaron' },
  { sortable: true, label: 'Valor Pagado', field: 'ValorPagado', align: 'left', name: 'ValorPagado', format: val => `${Utils.formatoMoneda(val, 2)}` },
  { sortable: true, label: 'Valor NoPagaron', field: 'ValorNoPagaron', align: 'left', name: 'ValorNoPagaron', format: val => `${Utils.formatoMoneda(val, 2)}` },
  { sortable: true, label: 'Acciones', field: 'Acciones', align: 'left', name: 'Acciones' },
]
const RANGOS_AVALUO = ref([
  { key: '0 - 40M', min: 0, max: 40000000, color: '#fee5d9' },
  { key: '40M - 80M', min: 40000000, max: 80000000, color: '#fcbba1' },
  { key: '80M - 140M', min: 80000000, max: 140000000, color: '#fc9272' },
  { key: '140M - 180M', min: 140000000, max: 180000000, color: '#fb6a4a' },
  { key: '180M - 400M', min: 180000000, max: 400000000, color: '#de2d26' },
  { key: '> 400M', min: 400000000, max: Infinity, color: '#a50f15' }
])

const RANGOS_IMPUESTO = ref([
  { key: '0 - 100K', min: 0, max: 100000, color: '#fee5d9' },
  { key: '100K - 300K', min: 100000, max: 300000, color: '#fcbba1' },
  { key: '300K - 500K', min: 300000, max: 500000, color: '#fc9272' },
  { key: '500K - 1M', min: 500000, max: 1000000, color: '#fb6a4a' },
  { key: '1M - 5M', min: 1000000, max: 5000000, color: '#de2d26' },
  { key: '> 5M', min: 5000000, max: Infinity, color: '#a50f15' }
])
const coloresObj = [
  { 1: 'red' },
  { 2: 'tan' },
  { 3: 'orange' },
  { 4: 'blue' },
  { 5: 'green' },
  { 6: 'purple' }
]

let leyendaRangosEl = null;
const fmtNum = v => (v == null ? '' : new Intl.NumberFormat('es-CO').format(Number(v)));
const fmtCOP = v => (v == null ? '' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(v)));
const esc = s => String(s ?? '').replace(/[&<>"'`=\/]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#47;', '`': '&#96;', '=': '&#61;' }[c]));

const buildInfoHtml = (z) => {
  const badgeBg = z.IsPago ? '#dbeafe' : '#fee2e2';
  const badgeTx = z.IsPago ? '#1e40af' : '#991b1b';
  const estado = z.IsPago ? 'PAGADO' : 'NO PAGADO';
  const comoTexto = encodeURIComponent(JSON.stringify(z))

  return `
  <div style="min-width:280px;max-width:380px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="width:10px;height:10px;border-radius:50%;background:${z.IsPago ? '#2563eb' : '#ef4444'};"></div>
      <div style="font-weight:600;font-size:16px;line-height:1">Predio</div>
      <div ondblclick="window.parent.postMessage({ accion: 'terminado', ficha: JSON.parse(decodeURIComponent('${comoTexto}')) }, '*')" style="margin-left:auto;font-size:11px;padding:2px 8px;border-radius:999px;background:${badgeBg};color:${badgeTx};font-weight:600">${estado}</div>
    </div>

    ${z.Direccion ? `<div style="font-size:12px;color:#374151;margin-bottom:8px">${esc(z.Direccion)}</div>` : ''}

    <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:12px;">
      <div style="color:#6b7280">Contribuyente</div><div>${esc(z.Contribuyente)}</div>
      <div style="color:#6b7280">Identificación</div><div>${esc(z.Identificacion)}</div>
      <div style="color:#6b7280">Correo</div><div>${esc(z.Correo)}</div>
      <div style="color:#6b7280">Telefono</div><div>${esc(z.Telefono)}</div>
      <div style="color:#6b7280">Comuna</div><div>${esc(z.Comuna)}</div>
      <div style="color:#6b7280">Barrio</div><div>${esc(z.Barrio)}</div>
      <div style="color:#6b7280">Zona</div><div>${esc(z.Zona)}</div>
      <div style="color:#6b7280">Condición</div><div>${esc(z.Condicion)}</div>
      <div style="color:#6b7280">Avalúo</div><div>${fmtCOP(z.Avaluo)}</div>
      <div style="color:#6b7280">Valor Anterior</div><div>${fmtCOP(z.ValorAnterior)}</div>
      <div style="color:#6b7280">Valor</div><div>${fmtCOP(z.Valor)}</div>
      <div style="color:#6b7280">Área (m²)</div><div>${fmtNum(z.Area)}</div>
      <div style="color:#6b7280">Área construida</div><div>${fmtNum(z.AreaConstruida)}</div>
      <div style="color:#6b7280">Hectáreas</div><div>${fmtNum(z.Hectareas)}</div>
      <div style="color:#6b7280">Estrato </div><div>${fmtNum(z.Estrato)}</div>
      <div style="color:#6b7280">Ficha</div><div style="word-break:break-all">${esc(z.FichaFinal)}</div>
    </div>
  </div>`;
}
const cerrarVentana = () => {
  isVerPredios.value = false
  drawingManager.setDrawingMode(null);

  if (areaSeleccionada) {
    areaSeleccionada.setMap(null);
    areaSeleccionada = null;
  }
  activarDibujo()
}
const activarDibujo = () => {
  if (drawingManager) {
    drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE)
  }
}
const renderizarPoligonos = async (nuevasZonas) => {

  const infoWindow = new google.maps.InfoWindow();

  nuevasZonas.forEach(zona => {

    if (!zona.WktLista) return;
    const listaPoligonos = []
    const anillos = agruparPorNivelAnillo(zona.WktLista);
    const color = zona.IsPago ? '#2563eb' : '#FF4B33';

    anillos.forEach(({ outer, holes }) => {
      const poligono = new google.maps.Polygon({
        paths: [outer, ...holes],
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0,
        clickable: true,
        map
      });

      poligono.addListener('click', e => {
        infoWindow.setContent(buildInfoHtml(zona));
        infoWindow.setPosition(e.latLng);
        infoWindow.open({ map });
      });

      listaPoligonos.push(poligono);
    });
    poligonosPorFicha.set(zona.FichaFinal, listaPoligonos);
  });



  // listaPoligonos.forEach(p => p.setMap(map));

  Utils.loadingNotify(false, '');

}
const renderizarZonasXRango = async (nuevasZonas, tipo) => {


  const infoWindow = new google.maps.InfoWindow()

  nuevasZonas.forEach(zona => {


    if (!zona.WktLista) return;
    const listaPoligonos = []
    const anillos = agruparPorNivelAnillo(zona.WktLista);
    const valorEvaluar = tipo === 'Avaluo' ? zona.Avaluo : zona.Valor;
    const color = colorPorAvaluo(valorEvaluar, tipo);

    anillos.forEach(({ outer, holes }) => {
      const poligono = new google.maps.Polygon({
        paths: [outer, ...holes],
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0,
        clickable: true,
        map
      });

      poligono.addListener('click', e => {
        infoWindow.setContent(buildInfoHtml(zona));
        infoWindow.setPosition(e.latLng);
        infoWindow.open({ map });
      });

      listaPoligonos.push(poligono);
    });
    poligonosPorFicha.set(zona.FichaFinal, listaPoligonos);
  });

  // poligonosPendientes.forEach(p => p.setMap(map));
  Utils.loadingNotify(false, '');

  agregarLeyendaRangos();
}

function agruparPorNivelAnillo(wktLista) {

  return wktLista.map(wkt => {
    const inner = wkt
      .replace(/^POLYGON\s*\(\(/i, "")
      .replace(/\)\)$/i, "");

    const ringsText = inner.split(/\)\s*,\s*\(/);

    const rings = ringsText.map(ring => {
      return ring
        .trim()
        .split(",")
        .map(pt => {
          const [lng, lat] = pt.trim().split(/\s+/).map(Number);
          return { lat, lng };
        });
    });

    return {
      outer: rings[0],
      holes: rings.slice(1)
    };
  });
}
const limpiarMapaCompleto = () => {
  poligonosDibujados = []
  poligonosPorFicha.clear()
  iniciarMapa()
}
// CARGAR MAPA -->>


const verDetalleXRango = (min, max) => {

  const tipo = filtro.value.Tipo;
  const { IsExcento, IsExcluido, IsProceso } = filtro.value

  let prediosRango = zonas.value.filter(p => {
    const valorComparar = tipo === 2 ? (p.Avaluo || 0) : (p.Valor || 0);
    return valorComparar >= min && valorComparar <= max;
  });

  const condiciones = {
    IsExcluido,
    IsExcento,
    ...(filtro.value.IsProceso ? { IsProceso } : {})
  }

  prediosRango = prediosRango.filter(z =>
    Object.entries(condiciones).every(([k, v]) => z[k] === v)
  )

  const LABEL_TODO = '(Seleccionar todo)'
  const raw = x => {
    if (x == null) return ''
    if (typeof x === 'object') return x.value ?? x.label ?? ''
    return x
  }
  const norm = a => {
    const out = new Set()
    for (const x of (Array.isArray(a) ? a : [])) {
      const v = String(raw(x)).trim()
      if (!v || v === LABEL_TODO) continue
      out.add(v.toLowerCase())
    }
    return out
  }

  const sComunas = norm(filtro.value.Comunas)
  const sBarrios = norm(filtro.value.Barrios)
  const sZonas = norm(filtro.value.Zonas)
  const sConds = norm(filtro.value.Condiciones)
  const sDestino = norm(filtro.value.Destinos)
  const sEstrato = norm(filtro.value.Estratos)

  const useComunas = sComunas.size > 0
  const useBarrios = sBarrios.size > 0
  const useZonas = sZonas.size > 0
  const useConds = sConds.size > 0
  const useEstrato = sEstrato.size > 0
  const useDestino = sDestino.size > 0

  prediosRango = prediosRango.filter(z =>
    (!useComunas || sComunas.has(String(z.Comuna ?? '').trim().toLowerCase())) &&
    (!useBarrios || sBarrios.has(String(z.Barrio ?? '').trim().toLowerCase())) &&
    (!useZonas || sZonas.has(String(z.Zona ?? '').trim().toLowerCase())) &&
    (!useConds || sConds.has(String(z.Condicion ?? '').trim().toLowerCase())) &&
    (!useEstrato || sEstrato.has(String(z.Estrato ?? '').trim().toLowerCase())) &&
    (!useDestino || sDestino.has(String(z.DestinoCatastro ?? '').trim().toLowerCase()))
  )


  const pagaronCount = prediosRango.filter(p => p.IsPago).length;
  const noPagaronCount = prediosRango.filter(p => !p.IsPago).length;

  const valorPagado = prediosRango
    .filter(p => p.IsPago)
    .reduce((sum, p) => sum + (p.Valor || 0), 0);

  const valorNoPagado = prediosRango
    .filter(p => !p.IsPago)
    .reduce((sum, p) => sum + (p.Valor || 0), 0);

  const total = pagaronCount + noPagaronCount;

  prediosAcumuladoRango.value = [
    {
      Pagaron: pagaronCount,
      min: min,
      max: max,
      NPagaron: 0,
      PPagaron: total > 0 ? ((pagaronCount / total) * 100).toFixed(1) : 0,
      IsPago: true,
      ValorPagado: valorPagado,
      ValorNoPagaron: 0,
      Acciones: null
    },
    {
      Pagaron: 0,
      IsPago: false,
      min: min,
      max: max,
      NPagaron: noPagaronCount,
      PNPagaron: total > 0 ? ((noPagaronCount / total) * 100).toFixed(1) : 0,
      ValorPagado: 0,
      ValorNoPagaron: valorNoPagado,
      Acciones: null
    }
  ];



  // Mostrar en la vista
  isVerPrediosRango.value = true;
  tab1.value = 'acumulado';
}
const verDetalleAcumulado = (min, max, isPago) => {
  const tipo = filtro.value.Tipo;
  const { IsExcento, IsExcluido, IsProceso } = filtro.value

  let prediosRango = zonas.value.filter(p => {
    const valorComparar = tipo === 2 ? (p.Avaluo || 0) : (p.Valor || 0);
    return valorComparar >= min && valorComparar <= max;
  });

  const condiciones = {
    IsExcluido,
    IsExcento,
    ...(filtro.value.IsProceso ? { IsProceso } : {})
  }

  prediosRango = prediosRango.filter(z =>
    Object.entries(condiciones).every(([k, v]) => z[k] === v)
  )

  const LABEL_TODO = '(Seleccionar todo)'
  const raw = x => {
    if (x == null) return ''
    if (typeof x === 'object') return x.value ?? x.label ?? ''
    return x
  }
  const norm = a => {
    const out = new Set()
    for (const x of (Array.isArray(a) ? a : [])) {
      const v = String(raw(x)).trim()
      if (!v || v === LABEL_TODO) continue
      out.add(v.toLowerCase())
    }
    return out
  }

  const sComunas = norm(filtro.value.Comunas)
  const sBarrios = norm(filtro.value.Barrios)
  const sZonas = norm(filtro.value.Zonas)
  const sConds = norm(filtro.value.Condiciones)
  const sDestino = norm(filtro.value.Destinos)
  const sEstrato = norm(filtro.value.Estratos)

  const useComunas = sComunas.size > 0
  const useBarrios = sBarrios.size > 0
  const useZonas = sZonas.size > 0
  const useConds = sConds.size > 0
  const useEstrato = sEstrato.size > 0
  const useDestino = sDestino.size > 0

  prediosRango = prediosRango.filter(z =>
    (!useComunas || sComunas.has(String(z.Comuna ?? '').trim().toLowerCase())) &&
    (!useBarrios || sBarrios.has(String(z.Barrio ?? '').trim().toLowerCase())) &&
    (!useZonas || sZonas.has(String(z.Zona ?? '').trim().toLowerCase())) &&
    (!useConds || sConds.has(String(z.Condicion ?? '').trim().toLowerCase())) &&
    (!useEstrato || sEstrato.has(String(z.Estrato ?? '').trim().toLowerCase())) &&
    (!useDestino || sDestino.has(String(z.DestinoCatastro ?? '').trim().toLowerCase()))
  )


  //

  prediosDetalleRango.value = prediosRango.filter(z => z.IsPago === isPago)
  tab1.value = 'detalle'
}

//Marcar solo los poligonos del rango
const mostrarEnMapa = async (min, max) => {

  const { IsExcento, IsExcluido, IsProceso } = filtro.value
  const tipo = filtro.value.Tipo;

  let prediosRango = zonas.value.filter(p => {
    const valorComparar = tipo === 2 ? (p.Avaluo || 0) : (p.Valor || 0);
    return valorComparar >= min && valorComparar <= max;
  });

  const condiciones = {
    IsExcluido,
    IsExcento,
    ...(filtro.value.IsProceso ? { IsProceso } : {})
  }

  prediosRango = prediosRango.filter(z =>
    Object.entries(condiciones).every(([k, v]) => z[k] === v)
  )


  // prediosRango = prediosRango.filter(z => z.IsExcluido === filtro.value.IsExcluido && z.IsExcento === filtro.value.IsExcento && z.IsProceso === filtro.value.IsProceso)

  const LABEL_TODO = '(Seleccionar todo)'
  const raw = x => {
    if (x == null) return ''
    if (typeof x === 'object') return x.value ?? x.label ?? ''
    return x
  }
  const norm = a => {
    const out = new Set()
    for (const x of (Array.isArray(a) ? a : [])) {
      const v = String(raw(x)).trim()
      if (!v || v === LABEL_TODO) continue
      out.add(v.toLowerCase())
    }
    return out
  }

  const sComunas = norm(filtro.value.Comunas)
  const sBarrios = norm(filtro.value.Barrios)
  const sZonas = norm(filtro.value.Zonas)
  const sConds = norm(filtro.value.Condiciones)
  const sDestino = norm(filtro.value.Destinos)
  const sEstrato = norm(filtro.value.Estratos)

  const useComunas = sComunas.size > 0
  const useBarrios = sBarrios.size > 0
  const useZonas = sZonas.size > 0
  const useConds = sConds.size > 0
  const useDestino = sDestino.size > 0
  const useEstrato = sEstrato.size > 0

  prediosRango = prediosRango.filter(z =>
    (!useComunas || sComunas.has(String(z.Comuna ?? '').trim().toLowerCase())) &&
    (!useBarrios || sBarrios.has(String(z.Barrio ?? '').trim().toLowerCase())) &&
    (!useZonas || sZonas.has(String(z.Zona ?? '').trim().toLowerCase())) &&
    (!useConds || sConds.has(String(z.Condicion ?? '').trim().toLowerCase())) &&
    (!useEstrato || sEstrato.has(String(z.Estrato ?? '').trim().toLowerCase())) &&
    (!useDestino || sDestino.has(String(z.DestinoCatastro ?? '').trim().toLowerCase()))
  )

  zonas.value = prediosRango

  limpiarMapaCompleto()
  await renderizarPoligonos(prediosRango)



  if (prediosRango.length > 0 && Array.isArray(prediosRango[0].WktLista)) {
    const anillos = agruparPorNivelAnillo(prediosRango[0].WktLista);

    const primerOuter = anillos.find(a => a.outer && a.outer.length > 0);

    if (primerOuter) {
      const punto = primerOuter.outer[0];
      const centro = { lat: punto.lat, lng: punto.lng };
      map.setCenter(centro);
      map.setZoom(11)
    }
  }
  renderizarGraficosPasteles()

};

//


const construirCantidadXRango = (zonasParametro) => {
  let rangoEvaluar = filtro.value.Tipo === 2
    ? RANGOS_AVALUO.value
    : RANGOS_IMPUESTO.value;

  const total = zonasParametro.length;

  return rangoEvaluar.map(rango => {
    const zonaEcontradas = zonasParametro.filter(z => {
      const valorComparar = filtro.value.Tipo === 2 ? (z.Avaluo || 0) : (z.Valor || 0);
      return valorComparar >= rango.min && valorComparar < rango.max;
    });

    const valorPagaron = zonaEcontradas
      .filter(z => z.IsPago)
      .reduce((acumulado, zona) => acumulado + (zona.Valor || 0), 0);

    const valorNPagaron = zonaEcontradas
      .filter(z => !z.IsPago)
      .reduce((acumulado, zona) => acumulado + (zona.Valor || 0), 0);

    return {
      Nombre: rango.key,
      min: rango.min,
      max: rango.max,
      Cantidad: zonaEcontradas.length,
      ValorPagaron: valorPagaron,
      ValorNPagaron: valorNPagaron,
      Porcentaje: total > 0
        ? ((zonaEcontradas.length / total) * 100).toFixed(2)
        : "0.00",
      Color: rango.color
    };
  });
};
const colorPorAvaluo = (avaluo) => {
  let rangoEvaluar = []

  if (filtro.value.Tipo === 2) {
    rangoEvaluar = RANGOS_AVALUO.value
  }
  else {
    rangoEvaluar = RANGOS_IMPUESTO.value
  }

  const v = Number(avaluo ?? 0);
  const r = rangoEvaluar.find(x => v >= x.min && v < x.max) ?? rangoEvaluar[0];
  if (!r) {
    return ''
  } else {
    return r.color;
  }

};
const agregarLeyendaRangos = () => {
  if (!map || leyendaRangosEl) return;

  const cont = document.createElement('div');
  cont.style.background = 'white';
  cont.style.padding = '8px 10px';
  cont.style.margin = '10px';
  cont.style.borderRadius = '8px';
  cont.style.boxShadow = '0 1px 4px rgba(0,0,0,.25)';
  cont.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif';
  cont.style.fontSize = '12px';

  const title = document.createElement('div');
  title.style.fontWeight = 700;
  title.style.textAlign = 'center';
  title.style.marginBottom = '6px';
  title.innerText = 'RANGO VALORES';
  cont.appendChild(title);

  const RANGOS_MOSTRAR = filtro.value.Tipo === 2 ? RANGOS_AVALUO.value : RANGOS_IMPUESTO.value

  RANGOS_MOSTRAR.forEach(r => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '8px';
    row.style.margin = '4px 0';

    const sw = document.createElement('div');
    sw.style.width = '28px';
    sw.style.height = '10px';
    sw.style.background = r.color;
    sw.style.borderRadius = '3px';

    const lb = document.createElement('div');
    lb.innerText = r.key;

    row.appendChild(sw);
    row.appendChild(lb);
    cont.appendChild(row);
  });

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(cont);
  leyendaRangosEl = cont;
};
const iniciarMapa = () => {

  const centro = { lat: 1.6339, lng: -75.6169 }
  map = new google.maps.Map(document.getElementById('map'), {
    center: centro,
    zoom: 19
  })

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: false,
    rectangleOptions: {
      fillColor: '#000',
      fillOpacity: 0.2,
      strokeWeight: 2,
      clickable: false,
      editable: false,
      zIndex: 1
    }
  })

  drawingManager.setMap(map)

  google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    if (areaSeleccionada) {
      areaSeleccionada.setMap(null)
    }
    areaSeleccionada = event.overlay
    drawingManager.setDrawingMode(null)
  })

  map.addListener('click', () => {
    if (areaSeleccionada) {
      areaSeleccionada.setMap(null)
      areaSeleccionada = null
    }
  })

}

//REPORTES --->>>

const seleccionarTodo = (valores, campo) => {
  if (!valores) return
  if (valores.includes('(Seleccionar todo)')) {
    filtro.value[campo] = [...filtroOpciones.value[campo]]
  } else {
    filtro.value[campo] = valores
  }
}
const seleccionarTodoBarrios = (valores) => {
  if (!valores) return
  if (valores.includes('all')) {
    filtroOpciones.value.Barrios = [...filtroOpciones.value.BarriosBase]
    filtro.value.Barrios = [...filtroOpciones.value.Barrios]
  } else {
    filtro.value.Barrios = valores
  }
}
const traerDatosFiltro = async () => {
  const { data } = await api.get('presupuesto/inicio/datos-filtro-mapa')
  const { Item1 = [], Item2 = [], Item3 = [], Item4 = [], Item5 = [], Item6 = [] } = data || {}
  filtroOpciones.value = {
    Comunas: Item2.map(v => ({ label: v, value: v })),
    Barrios: Item1.map(v => ({ label: v, value: v })),
    Zonas: Item3.map(v => ({ label: v, value: v })),
    Condiciones: Item4.map(v => ({ label: v, value: v })),
    Destinos: Item5.map(v => ({ label: v, value: v })),
    Estratos: Item6.map(v => ({ label: v, value: v }))
  }
  filtroOpciones.value.BarriosBase = [...filtroOpciones.value.Barrios]
}
//

const filtrarPrediosEnArea = () => {
  if (!areaSeleccionada) {
    Notify.create({ type: 'warning', message: 'Primero selecciona un área en el mapa' })
    return
  }

  const bounds = areaSeleccionada.getBounds();

  const prediosEnArea = zonas.value.filter(z => {
    if (!z.WktLista || !Array.isArray(z.WktLista)) return false;

    const anillos = agruparPorNivelAnillo(z.WktLista);

    return anillos.some(({ outer, holes }) => {
      const puntosEnOuter = outer.some(c =>
        bounds.contains(new google.maps.LatLng(c.lat, c.lng))
      );

      const puntosEnHoles = holes.some(hueco =>
        hueco.some(c =>
          bounds.contains(new google.maps.LatLng(c.lat, c.lng))
        )
      );

      return puntosEnOuter || puntosEnHoles;
    });
  });


  prediosSeleccionados.value = [...prediosEnArea]

  const pagaronCount = prediosSeleccionados.value.filter(p => p.IsPago).length
  const noPagaronCount = prediosSeleccionados.value.filter(p => !p.IsPago).length
  const valorPagado = prediosSeleccionados.value
    .filter(p => p.IsPago)
    .reduce((sum, p) => sum + (p.Valor || 0), 0)
  const valorNoPagado = prediosSeleccionados.value
    .filter(p => !p.IsPago)
    .reduce((sum, p) => sum + (p.Valor || 0), 0)

  const total = pagaronCount + noPagaronCount;

  prediosAcumulado.value = [
    {
      Pagaron: pagaronCount,
      NPagaron: 0,
      PPagaron: total > 0 ? ((pagaronCount / total) * 100).toFixed(1) : 0,
      IsPago: true,
      ValorPagado: valorPagado,
      ValorNoPagaron: 0,
      Acciones: null
    },
    {
      Pagaron: 0,
      IsPago: false,
      NPagaron: noPagaronCount,
      PNPagaron: total > 0 ? ((noPagaronCount / total) * 100).toFixed(1) : 0,
      ValorPagado: 0,
      ValorNoPagaron: valorNoPagado,
      Acciones: null
    }
  ];


  isVerPredios.value = true
  tab.value = 'acumulado'
}
const filtrarBarrios = (val, update) => {
  update(() => {
    try {
      const texto = (val || '').toLowerCase()
      filtroOpciones.value.Barrios = (filtroOpciones.value.BarriosBase || []).filter(
        b => (b.label || '').toLowerCase().includes(texto)
      )
    } catch (err) {
      console.error('Error filtrando barrios:', err)
      filtroOpciones.value.Barrios = []
    }
  })
}
const verDetalle = (estado) => {

  console.log('asaasas')
  const { IsExcento, IsExcluido, IsProceso } = filtro.value
  prediosDetalle.value = prediosSeleccionados.value.filter(p => p.IsPago === estado)

  // Filtro de lo que se selecciono

  const LABEL_TODO = '(Seleccionar todo)'
  const raw = x => {
    if (x == null) return ''
    if (typeof x === 'object') return x.value ?? x.label ?? ''
    return x
  }
  const norm = a => {
    const out = new Set()
    for (const x of (Array.isArray(a) ? a : [])) {
      const v = String(raw(x)).trim()
      if (!v || v === LABEL_TODO) continue
      out.add(v.toLowerCase())
    }
    return out
  }

  const sComunas = norm(filtro.value.Comunas)
  const sBarrios = norm(filtro.value.Barrios)
  const sZonas = norm(filtro.value.Zonas)
  const sConds = norm(filtro.value.Condiciones)
  const sDestino = norm(filtro.value.Destinos)
  const sEstrato = norm(filtro.value.Estratos)

  const useComunas = sComunas.size > 0
  const useBarrios = sBarrios.size > 0
  const useZonas = sZonas.size > 0
  const useConds = sConds.size > 0
  const useDestino = sDestino.size > 0
  const useEstrato = sEstrato.size > 0

  prediosDetalle.value = prediosDetalle.value.filter(z =>
    (!useComunas || sComunas.has(String(z.Comuna ?? '').trim().toLowerCase())) &&
    (!useBarrios || sBarrios.has(String(z.Barrio ?? '').trim().toLowerCase())) &&
    (!useZonas || sZonas.has(String(z.Zona ?? '').trim().toLowerCase())) &&
    (!useConds || sConds.has(String(z.Condicion ?? '').trim().toLowerCase())) &&
    (!useEstrato || sEstrato.has(String(z.Estrato ?? '').trim().toLowerCase())) &&
    (!useDestino || sDestino.has(String(z.DestinoCatastro ?? '').trim().toLowerCase()))
  )

  console.log(prediosDetalle.value)
  //
  const condiciones = {
    IsExcluido,
    IsExcento,
    ...(filtro.value.IsProceso ? { IsProceso } : {})
  }

  prediosDetalle.value = prediosDetalle.value.filter(z =>
    Object.entries(condiciones).every(([k, v]) => z[k] === v)
  )
  console.log(prediosDetalle.value)
  // prediosDetalle.value = prediosDetalle.value.filter(z => z.IsExcluido === filtro.value.IsExcluido && z.IsExcento === filtro.value.IsExcento && z.IsProceso === filtro.value.IsProceso)

  tab.value = 'detalle'
}
const consolidarFiltroActual = () => {
  detalleConsolidado.value = construirConsolidado(zonas.value)
  isVerDetalle.value = true
}
const construirConsolidado = (items) => {

  const LABEL_TODO = '(Seleccionar todo)'
  const raw = x => {
    if (x == null) return ''
    if (typeof x === 'object') return x.value ?? x.label ?? ''
    return x
  }

  const norm = a => {
    const out = new Set()
    for (const x of (Array.isArray(a) ? a : [])) {
      const v = String(raw(x)).trim()
      if (!v || v === LABEL_TODO) continue
      out.add(v.toLowerCase())
    }
    return out
  }

  // Normalizamos como en tu filtrado anterior
  const sComunas = norm(filtro.value.Comunas)
  const sBarrios = norm(filtro.value.Barrios)
  const sZonas = norm(filtro.value.Zonas)
  const sConds = norm(filtro.value.Condiciones)
  const sDest = norm(filtro.value.Destinos)

  // Determinar por cuál campo agrupar
  let campoAgrupar = null
  if (sBarrios.size > 0) campoAgrupar = 'Barrio'
  else if (sComunas.size > 0) campoAgrupar = 'Comuna'
  else if (sZonas.size > 0) campoAgrupar = 'Zona'
  else if (sConds.size > 0) campoAgrupar = 'Condicion'
  else if (sDest.size > 0) campoAgrupar = 'DestinoCatastro'

  if (!campoAgrupar) campoAgrupar = 'Comuna' // default si nada está seleccionado

  const grupo = new Map()

  for (const it of items) {
    const clave = it?.[campoAgrupar] ?? '(Sin dato)'
    if (!grupo.has(clave)) {
      grupo.set(clave, { Pagaron: 0, NPagaron: 0, ValorPagado: 0, ValorNoPagaron: 0 })
    }
    const g = grupo.get(clave)
    if (it?.IsPago) {
      g.Pagaron += 1
      g.ValorPagado += Number(it?.Valor || 0)
    } else {
      g.NPagaron += 1
      g.ValorNoPagaron += Number(it?.Valor || 0)
    }
  }

  console.log(grupo, 'asasas')

  const salida = []
  for (const [clave, v] of grupo.entries()) {
    const total = v.Pagaron + v.NPagaron;
    const porcentajePagaron = total > 0 ? ((v.Pagaron / total) * 100).toFixed(1) : 0;
    const porcentajeNoPagaron = total > 0 ? ((v.NPagaron / total) * 100).toFixed(1) : 0;

    salida.push({
      Campo: `${campoAgrupar}: ${clave}`,
      IsPago: v.IsPago,
      Pagaron: v.Pagaron,
      PPagaron: porcentajePagaron,
      NPagaron: v.NPagaron,
      PNPagaron: porcentajeNoPagaron,
      ValorPagado: v.ValorPagado,
      ValorNoPagaron: v.ValorNoPagaron,
      VigMinima: v.VigMinima,
      IsProceso: v.IsProceso,
      VigMaxima: v.VigMaxima,
      IsPago: v.IsPago,
      ValorAnterior: v.ValorAnterior,
    });
  }

  return salida
}
const generarMapaConFiltro = async () => {

  Utils.loadingNotify(true, 'Cargando informacion ...');
  const { Tipo, IsExcento, IsExcluido, IsProceso } = filtro.value
  zonas.value = []
  limpiarMapaCompleto()

  const LABEL_TODO = '(Seleccionar todo)'
  const raw = x => {
    if (x == null) return ''
    if (typeof x === 'object') return x.value ?? x.label ?? ''
    return x
  }
  const norm = a => {
    const out = new Set()
    for (const x of (Array.isArray(a) ? a : [])) {
      const v = String(raw(x)).trim()
      if (!v || v === LABEL_TODO) continue
      out.add(v.toLowerCase())
    }
    return out
  }

  const sComunas = norm(filtro.value.Comunas)
  const sBarrios = norm(filtro.value.Barrios)
  const sZonas = norm(filtro.value.Zonas)
  const sConds = norm(filtro.value.Condiciones)
  const sDestino = norm(filtro.value.Destinos)
  const sEstrato = norm(filtro.value.Estratos)


  const useComunas = sComunas.size > 0
  const useBarrios = sBarrios.size > 0
  const useZonas = sZonas.size > 0
  const useConds = sConds.size > 0
  const useDestino = sDestino.size > 0
  const useEstrato = sEstrato.size > 0

  zonas.value = zonasBase.value.filter(z =>
    (!useComunas || sComunas.has(String(z.Comuna ?? '').trim().toLowerCase())) &&
    (!useBarrios || sBarrios.has(String(z.Barrio ?? '').trim().toLowerCase())) &&
    (!useZonas || sZonas.has(String(z.Zona ?? '').trim().toLowerCase())) &&
    (!useConds || sConds.has(String(z.Condicion ?? '').trim().toLowerCase())) &&
    (!useEstrato || sEstrato.has(String(z.Estrato ?? '').trim().toLowerCase())) &&
    (!useDestino || sDestino.has(String(z.DestinoCatastro ?? '').trim().toLowerCase()))
  )

  const condiciones = {
    IsExcluido,
    IsExcento,
    ...(filtro.value.IsProceso ? { IsProceso } : {})
  }

  zonas.value = zonas.value.filter(z =>
    Object.entries(condiciones).every(([k, v]) => z[k] === v)
  )

  switch (Tipo) {
    case 1:
      await renderizarPoligonos(zonas.value)
      break;
    case 2:
      await renderizarZonasXRango(zonas.value, 'Avaluo')
      break;
    case 3:
      await renderizarZonasXRango(zonas.value, 'Valor')
      break;
  }

  if (zonas.value.length > 0 && Array.isArray(zonas.value[0].WktLista)) {
    const anillos = agruparPorNivelAnillo(zonas.value[0].WktLista);

    // Busca el primer punto válido en los outer
    const primerOuter = anillos.find(a => a.outer && a.outer.length > 0);

    if (primerOuter) {
      const punto = primerOuter.outer[0];
      const centro = { lat: punto.lat, lng: punto.lng };
      map.setCenter(centro);
    }
  }
  renderizarGraficosPasteles()
}
const renderizarMapaConfiltro = (val) => {

  filtro.value.Tipo = val
  Utils.loadingNotify(true, 'Generando mapa...')
  map = null
  setTimeout(() => {
    generarMapaConFiltro()
  }, 500)
}

// GRAFICOS -> REPORTE
const abrirGraficos = async (modo = 'conteo') => {
  isVerGraficos.value = true
  await nextTick()

  const el = document.getElementById('grafico')
  if (!el) return console.warn('No existe #grafico')

  if (el.offsetWidth === 0 || el.offsetHeight === 0) return

  const base = construirConsolidado(zonas.value.length ? zonas.value : zonasBase.value)
  const data = []
  for (const r of base) {
    if (modo === 'conteo') {
      data.push({ campo: r.Campo, serie: 'Pagaron', valor: r.Pagaron })
      data.push({ campo: r.Campo, serie: 'No pagaron', valor: r.NPagaron })
    } else {
      data.push({ campo: r.Campo, serie: 'Valor pagado', valor: r.ValorPagado })
      data.push({ campo: r.Campo, serie: 'Valor no pagado', valor: r.ValorNoPagaron })
    }
  }

  if (grafico) {
    grafico.changeData(data)
    return
  }

  grafico = new Column('grafico', {
    data,
    xField: 'campo',
    yField: 'valor',
    seriesField: 'serie',
    isGroup: true,
    autoFit: true,
    columnStyle: { radius: [4, 4, 0, 0] },
    label: { position: 'middle', style: { fill: '#fff', opacity: 0.9 } },
    xAxis: { label: { autoRotate: false } },
    yAxis: { label: { formatter: v => new Intl.NumberFormat('es-CO').format(Number(v)) } },
    legend: { position: 'top' }
  })
  grafico.render()
}

const LABEL_TODO = '(Seleccionar todo)';
function norm(a) {
  const out = new Set();
  for (const x of (Array.isArray(a) ? a : [])) {
    const v = x == null ? '' : (typeof x === 'object' ? (x.value ?? x.label ?? '') : x);
    if (!v || v === LABEL_TODO) continue;
    out.add(String(v).trim().toLowerCase());
  }
  return out;
}
async function abrirGraficosRango() {

  const sComunas = norm(filtro.value.Comunas);
  const sBarrios = norm(filtro.value.Barrios);
  const sZonas = norm(filtro.value.Zonas);
  const sConds = norm(filtro.value.Condiciones);
  const sDestino = norm(filtro.value.Destinos)
  const sEstrato = norm(filtro.value.Estratos)

  const useComunas = sComunas.size > 0;
  const useBarrios = sBarrios.size > 0;
  const useZonas = sZonas.size > 0;
  const useConds = sConds.size > 0;
  const useDestino = sDestino.size > 0
  const useEstrato = sEstrato.size > 0

  zonas.value = zonasBase.value.filter(z =>
    (!useComunas || sComunas.has((z.Comuna ?? '').trim().toLowerCase())) &&
    (!useBarrios || sBarrios.has((z.Barrio ?? '').trim().toLowerCase())) &&
    (!useZonas || sZonas.has((z.Zona ?? '').trim().toLowerCase())) &&
    (!useConds || sConds.has((z.Condicion ?? '').trim().toLowerCase())) &&
    (!useEstrato || sEstrato.has((z.Estrato ?? '').trim().toLowerCase())) &&
    (!useDestino || sDestino.has(String(z.DestinoCatastro ?? '').trim().toLowerCase()))
  );

  const tipo = filtro.value.Tipo;
  const rangos = tipo === 2 ? RANGOS_AVALUO.value : (tipo === 3 ? RANGOS_IMPUESTO.value : []);

  const acumulados = {};

  for (const z of zonas.value) {
    const barrio = (z.Barrio ?? 'Sin barrio').trim();
    const valor = tipo === 2 ? z.Avaluo : z.Valor;

    const rangoObj = rangos.find(r => valor >= r.min && valor < r.max);
    if (!rangoObj) continue;

    if (!acumulados[barrio]) acumulados[barrio] = {};
    if (!acumulados[barrio][rangoObj.key]) {
      acumulados[barrio][rangoObj.key] = {
        pagaron: 0,
        noPagaron: 0,
        color: rangoObj.color
      };
    }

    if (z.IsPago) acumulados[barrio][rangoObj.key].pagaron++;
    else acumulados[barrio][rangoObj.key].noPagaron++;
  }

  const data = [];

  for (const [barrio, rangosData] of Object.entries(acumulados)) {
    const totalBarrio = Object.values(rangosData)
      .reduce((sum, r) => sum + r.pagaron + r.noPagaron, 0);

    for (const [rangoKey, vals] of Object.entries(rangosData)) {
      const totalRango = vals.pagaron + vals.noPagaron;

      if (vals.pagaron > 0) {
        data.push({
          barrio,
          rango: rangoKey,
          estado: 'Pagaron',
          valor: vals.pagaron,
          porcentaje: ((vals.pagaron / totalBarrio) * 100).toFixed(1),
          totalRango,
          pagaron: vals.pagaron,
          noPagaron: vals.noPagaron,
          color: vals.color
        });
      }
      if (vals.noPagaron > 0) {
        data.push({
          barrio,
          rango: rangoKey,
          estado: 'No pagaron',
          valor: -vals.noPagaron, // sigue negativo para que se dibuje abajo
          porcentaje: ((vals.noPagaron / totalBarrio) * 100).toFixed(1),
          totalRango,
          pagaron: vals.pagaron,
          noPagaron: vals.noPagaron,
          color: vals.color
        });
      }
    }
  }

  isverGraficoXRango.value = true;
  await nextTick();

  const el = document.getElementById('GraficoRango');
  if (!el) return;
  if (el.offsetWidth === 0 || el.offsetHeight === 0) return;

  if (graficoRango) {
    graficoRango.changeData(data);
    return;
  }

  graficoRango = new Column('GraficoRango', {
    data,
    isGroup: true,
    xField: 'barrio',
    yField: 'valor',
    seriesField: 'estado',
    groupField: 'rango',
    colorField: 'color',
    columnStyle: { radius: [4, 4, 0, 0] },
    label: {
      position: 'middle',
      style: { fill: '#000', opacity: 0.9 },
      formatter: ({ rango, valor, porcentaje }) =>
        `${rango}\n${Math.abs(valor)} (${porcentaje}%)`
    },
    tooltip: {
      customContent: (title, items) => {
        if (!items || !items.length) return '';
        const item = items[0].data; // la barra seleccionada
        return `
          <div style="padding:5px;">
            <b>Barrio:</b> ${item.barrio}<br>
            <b>Rango:</b> ${item.rango}<br>
            <b>Total en rango:</b> ${item.totalRango}<br>
            <span style="color:green;">Pagaron:</span> ${item.pagaron}<br>
            <span style="color:red;">No pagaron:</span> ${item.noPagaron}<br>
            <b>Porcentaje:</b> ${item.porcentaje}%
          </div>
        `;
      }
    },
    xAxis: { label: { autoRotate: false } },
    yAxis: {
      label: {
        formatter: v => new Intl.NumberFormat('es-CO').format(Math.abs(v))
      },
      line: { style: { stroke: '#000' } },
      grid: { line: { style: { stroke: '#eee' } } }
    },
    legend: { position: 'top' }
  });

  graficoRango.render();
}

//Adicional a lo que solicitaron

const abrirBuscarPredio = () => {
  isVerbuscarPredio.value = true
}
// const seleccionarFila = (event, zona) => {
//   const zonasLista = [zona]
//   seleccionarFilaMultiple(zonasLista)
// }

let fichasAnteriores = ref([])
const seleccionarFilaMultiple = async (zonasLista) => {

  Utils.loadingNotify(true, 'Cargando...')

  const { Tipo } = filtro.value
  const infoWindow = new google.maps.InfoWindow()

  const limpiarPoligonosPorZonas = (zonas) => {
    zonas.forEach(zona => {
      const ficha = zona.FichaFinal
      if (poligonosPorFicha.has(ficha)) {
        poligonosPorFicha.get(ficha).forEach(poligono => poligono.setMap(null))
        poligonosPorFicha.delete(ficha)
      } else {
        console.log('No existe ficha', ficha)
      }
    })
  }

  limpiarPoligonosPorZonas(fichasAnteriores.value)

  if (fichasAnteriores.value.length > 0) {

    switch (Tipo) {

      case 1:
        await renderizarPoligonos(fichasAnteriores.value)
        break;
      case 2:
        await renderizarZonasXRango(fichasAnteriores.value, 'Avaluo')
        break;
      case 3:
        await renderizarZonasXRango(fichasAnteriores.value, 'Valor')
        break;
    }
  }

  fichasAnteriores.value = zonasLista

  zonasLista.forEach(zonaEncontrada => {

    const ficha = zonaEncontrada.FichaFinal

    const zonaMarcar = zonasBase.value.find(z => z.FichaFinal === ficha)

    if (!zonaMarcar) {
      Notify.create({ type: 'warning', message: 'No se encontró el predio' })
      return
    }

    if (poligonosPorFicha.has(ficha)) {

      poligonosPorFicha.get(ficha).forEach(poligono => {
        poligono.setOptions({
          strokeColor: '#ffff00',
          fillColor: '#ffff00',
          strokeOpacity: 0.9,
          fillOpacity: 0.2,
          clickable: true
        })
      })

      const anillos = agruparPorNivelAnillo(zonaMarcar.WktLista);
      const primerOuter = anillos.find(a => a.outer && a.outer.length > 0);

      if (primerOuter) {
        const punto = primerOuter.outer[0];
        const centro = { lat: punto.lat, lng: punto.lng };
        map.setCenter(centro);
      }

    } else {

      //No existe

      if (!zonaMarcar.WktLista || zonaMarcar.WktLista.length === 0) return

      const anillos = agruparPorNivelAnillo(zonaMarcar.WktLista)
      const nuevosPoligonos = []

      anillos.forEach(({ outer, holes }) => {

        const poligono = new google.maps.Polygon({
          paths: [outer, ...holes],
          strokeColor: '#ffff00',
          strokeOpacity: 0.9,
          strokeWeight: 2,
          fillColor: '#ffff00',
          fillOpacity: 0.2,
          clickable: true,
          map
        })

        poligono.addListener('click', e => {
          infoWindow.setContent(contruirHTMLModal(zonaMarcar))
          infoWindow.setPosition(e.latLng)
          infoWindow.open({ map })
        })

        nuevosPoligonos.push(poligono)
      })

      poligonosPorFicha.set(ficha, nuevosPoligonos)

      const primerOuter = anillos.find(a => a.outer && a.outer.length > 0)

      if (primerOuter) {
        const punto = primerOuter.outer[0]
        const centro = { lat: punto.lat, lng: punto.lng }
        map.setCenter(centro)
        map.setZoom(17)
      }

    }
  })
  Utils.loadingNotify(false, '')
  selected.value = []
  isVerbuscarPredio.value = false
}


const buscarPrediosXNombre = () => {

  let valor = filtro.value.Texto.trim().toLowerCase()

  prediosFiltrados.value = zonasBase.value.filter(z => {

    const contrib = z.Contribuyente?.toLowerCase() || ''

    const contribPalabras = contrib.split(/\s+/).filter(Boolean)
    const valorPalabras = valor.split(/\s+/).filter(Boolean)

    const coincideParcial = contrib.includes(valor)

    const coincidePalabras = valorPalabras.every(p =>
      contribPalabras.includes(p)
    )

    return (
      (coincideParcial || coincidePalabras) ||
      (z.Comuna && z.Comuna.toLowerCase().includes(valor)) ||
      (z.Barrio && z.Barrio.toLowerCase().includes(valor)) ||
      (z.Zona && z.Zona.toLowerCase().includes(valor)) ||
      (z.Condicion && z.Condicion.toLowerCase().includes(valor)) ||
      (z.Identificacion && z.Identificacion.toLowerCase().includes(valor)) ||
      (z.DestinoCatastro && z.DestinoCatastro.toLowerCase().includes(valor)) ||
      (z.Estrato && z.Estrato.toLowerCase().includes(valor)) ||
      (z.FichaFinal && z.FichaFinal.toLowerCase().includes(valor))
    )
  })


  // let valor = filtro.value.Texto.trim().toLowerCase()
  // prediosFiltrados.value = zonasBase.value.filter(z => {
  //   return (
  //     (z.Contribuyente && z.Contribuyente.toLowerCase().includes(valor)) ||
  //     (z.Comuna && z.Comuna.toLowerCase().includes(valor)) ||
  //     (z.Barrio && z.Barrio.toLowerCase().includes(valor)) ||
  //     (z.Zona && z.Zona.toLowerCase().includes(valor)) ||
  //     (z.Condicion && z.Condicion.toLowerCase().includes(valor)) ||
  //     (z.Identificacion && z.Identificacion.toLowerCase().includes(valor)) ||
  //     (z.useDestino && z.useDestino.toLowerCase().includes(valor)) ||
  //     (z.FichaFinal && z.FichaFinal.toLowerCase().includes(valor))
  //   )
  // })

}

//Generar archivo excel

const generarExcel = async (datos, columnas, nombreArchivo = 'Reporte') => {
  if (!datos || datos.length === 0) {
    Utils.notificacion('No hay datos para exportar', false)
    return
  }
  const data = datos.map(row => {
    let obj = {}
    columnas.forEach(col => {
      const valor = row[col.field]
      obj[col.label] = typeof col.format === 'function' ? col.format(valor) : valor
    })
    return obj
  })

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Hoja1')

  const fecha = new Date().toISOString().split('T')[0]
  XLSX.writeFile(wb, `${nombreArchivo}_${fecha}.xlsx`)
}

// GRAFICOS PASTELES

const renderizarGraficosPasteles = () => {
  renderizarGraficoQuienesPagaron()
}
const renderizarGraficoQuienesPagaron = () => {
  const pagaron = zonas.value.filter(p => p.IsPago)
  const noPagaron = zonas.value.filter(p => !p.IsPago)

  const pagaronCount = pagaron.length
  const noPagaronCount = noPagaron.length
  const valorPagado = pagaron.reduce((sum, p) => sum + (p.Valor || 0), 0)
  const valorNoPagado = noPagaron.reduce((sum, p) => sum + (p.Valor || 0), 0)

  const totalCantidad = pagaronCount + noPagaronCount
  const totalValor = valorPagado + valorNoPagado

  prediosAcumulado.value = [
    { tipo: 'Pagaron', cantidad: pagaronCount, valor: valorPagado },
    { tipo: 'No pagaron', cantidad: noPagaronCount, valor: valorNoPagado }
  ]

  detalleConsolidadoPastel.value = construirConsolidado(zonas.value)

  const data = prediosAcumulado.value.map(item => {
    const porcentaje = totalCantidad > 0 ? (item.cantidad / totalCantidad) * 100 : 0
    return {
      tipo: item.tipo,
      value: item.cantidad,
      valorMoneda: item.valor,
      porcentaje: porcentaje.toFixed(1)
    }
  })

  // Limpiar gráfico previo
  if (graficoPastel) {
    graficoPastel.destroy()
    graficoPastel = null
  }

  graficoPastel = new Pie('graficoPastel', {
    data,
    angleField: 'value',
    colorField: 'tipo',
    color: ['#2563eb', '#FF4B33'], // Azul y rojo
    radius: 1,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ value, valorMoneda, porcentaje }) =>
        `${value} (${porcentaje}%)\n$${new Intl.NumberFormat('es-CO').format(valorMoneda)}`,
      style: {
        fill: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
      }
    },
    legend: { position: 'bottom' },
    interactions: [{ type: 'element-active' }]
  })

  graficoPastel.render()
}


const redondearNumeroAMillones = (numero) => {
  const MILLON = 1_000_000
  if (numero >= MILLON) {
    numero = new Intl.NumberFormat('es-CO').format(Math.floor(numero / MILLON))
    return `${numero} M`
  } else {
    const miles = new Intl.NumberFormat('es-CO').format(numero);
    return `${miles}`;
  }
}


// Iniciar guardado de informacion mapa
const instancia = localforage.createInstance({
  name: 'NeosageMapa',
  storeName: 'Datos'
})
const guardarInformacion = async () => {
  if (!(await Utils.cofirmarAccion(`Seguro de descargar la informacion de las zonas esto puede tomar un tiempo`, null))) {
    return
  }
  let zonasGuardar = []
  let desde = 0
  let isPeticion = false
  Utils.loadingNotify(true, 'Descargando información')
  while (!isPeticion) {
    const peticion = {
      CantidadInicial: desde,
      IdVigencia: 2025,
      CantidadHasta: desde + tamanoBloque
    }
    const response = await api.post('presupuesto/inicio/mapa', peticion)
    // isPeticion = true
    if (!response.data.Dato || response.data.Dato.length === 0) {
      isPeticion = true
    } else {
      zonasGuardar = zonasGuardar.concat(response.data.Dato)
      desde += tamanoBloque
    }
  }

  await instancia.setItem('zonas', [])
  await instancia.setItem('zonas', zonasGuardar)
  datosEncontrados.value = [...zonasGuardar]

  cargarMapaInicial(zonasGuardar)
  Utils.loadingNotify(false, '')
  Utils.notificacion(`Zonas guardadas exitosamente`, true)
}
const obtenerDatos = async () => {
  const datos = {}
  try {
    await instancia.iterate((value, key) => {
      datos[key] = value
    })
    return datos
  } catch (error) {
    console.error('Error al obtener los datos', error)
    return null
  }
}
const cargarMapaInicial = (zonasGuardadas) => {
  traerDatosFiltro()
  zonasBase.value = [...zonasGuardadas]
  zonas.value = [...zonasGuardadas]
  datosEncontrados.value = zonasGuardadas

  const script = document.createElement('script')
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBVAeaT9vfL6BrNA-GbiC6k7ZpO1s15HTw&libraries=drawing'
  script.async = true
  script.defer = true
  script.onload = () => {

    generarMapaConFiltro()
  }
  document.head.appendChild(script)
  isInformacionDescargada.value = true
}

// AI
const filtroAI = ref('')
const diccionarioFiltros = {
  estado: "IsPago",
  incluyeEstado: "IsPago",
  valorMin: ["Valor", "Avaluo"],
  valorMax: ["Valor", "Avaluo"],
  valorEntre: ["Valor", "Avaluo"],
  nombreIncluye: ["Comuna", "Barrio", "Zona", "Condicion", "DestinoCatastro", "Identificacion", "FichaFinal", "Contribuyente"],
  nombreExacto: ["Comuna", "Barrio", "Zona", "Condicion", "DestinoCatastro", "Identificacion", "FichaFinal", "Contribuyente"],
  excluirNombre: ["Comuna", "Barrio", "Zona", "Condicion", "DestinoCatastro", "Identificacion", "FichaFinal", "Contribuyente"],
  excluido: "IsExcluido",
  excluido: "IsProceso",
  identificacion: "Identificacion",
  contribuyente: "Contribuyente",
  fichaFinal: "FichaFinal",
  excento: "IsExcento"
}
const construirPrompt = () => {
  return `
  Eres un generador de JSON Listo para parsear en mi codigo!, que siempre devuelve JSON limpio,
  sin backticks ni texto extra. Solo JSON válido listo para parsear nada de comillas ni saltos de linea
  Ejemplo JSON esperado :
  {"estado":"pagado","nombreExacto":"Centro","campo":"Barrio"}
  .

  REGLAS DE SALIDA:
  - Devuelve únicamente un objeto JSON válido y minificado.
  -Devuelte el valor del objeto sin tildes cuanto el tipo sea nombreExacto.
  - No escribas nada fuera del JSON (sin explicaciones, markdown, comentarios ni texto adicional).
  - Si no puedes generar datos válidos, responde exactamente: {}

  VALIDACIÓN:
  - Usa solo estas claves permitidas:
    - estado: "pagado" | "no pagado"
    - incluyeEstado: "pagado" | "no pagado"
    - valorMin: número
    - valorMax: número
    - valorEntre: [número, número]
    - nombreIncluye: string
    - nombreExacto: string
    - excluirNombre: string
    - excluido: true | false
    - excento: true | false
    - identificacion: string
    - contribuyente: string
    - fichaFinal: string
    - campo: "Comuna" | "Barrio" | "Zona" | "Condicion" | "DestinoCatastro" | "Contribuyente" | "Identificacion" | "FichaFinal" | "Valor" | "Avaluo" | "Todos"

  REGLAS ESPECIALES:
    - Si menciona cuantos han pagado o cuantos deben o algo relacionado a la cartera es decir deben o han pagado:
    * "pagado", "pago", "cancelado", "al día", "ya pagó" → estado:"pagado"
    * "no pagado", "debe", "pendiente", "sin pagar", "moroso" → estado:"no pagado"
  -si el numero es 1 millon pues en numeros es 1000000, ten en cuenta eso
  -si el numero es 100k son 100000 la k significa mil y el m millones
  - Si el texto parece un nombre de persona → usar "contribuyente".
  -Si el texto parece un barrio no los busques por nombre exacto por que posiblemente no se escribe asi -> usar "nombreIncluye".
  - Si el texto parece un número de cédula (≤ 12 dígitos) → usar "identificacion".
  - Si el texto es un código largo (≥ 15 dígitos) → usar "fichaFinal".
  - Si el usuario menciona "avaluo" → el campo es "Avaluo".
  - Si el usuario menciona "impuesto" o "valor" → el campo es "Valor".
  - Si hay rango (ej: "entre 100000 y 200000") → usar "valorEntre":[100000,200000].
  -Si hay un numero de 0 - 25 caracteres → usar "fichaFinal".
  - Puedes combinar múltiples claves en la respuesta.


  EJEMPLOS:

  Usuario: "Los que no si han pagado o personas que han pagado Libertad"
  Respuesta: {"estado":"pagado","nombreExacto":"Libertad","campo":"Todos"}

  Usuario: "Los que no han pagado o personas que no han pagado Libertad"
  Respuesta: {"estado":"no pagado","nombreExacto":"Libertad","campo":"Todos"}

  usuario: "Cuantas personas han pagado"
  Respuesta : {"estado":"pagado"}

  usuario: "Cuantas personas no han pagado"
  Respuesta : {"estado":"no pagado"}

  Usuario: "Personas o fichas que no han pagado o deben"
  Respuesta: {"estado":"no pagado"}

  Usuario: "Personas o fichas que han pagado o estan al dia"
  Respuesta: {"estado":"pagado"}

  Usuario: "Barrio Libertad"
  Respuesta: {"nombreIncluye":"Barrio Norte","campo":"Barrio"}

  Usuario: "123456789"
  Respuesta: {"identificacion":"123456789"}

  Usuario: "0102000002320001000000000"
  Respuesta: {"fichaFinal":"0102000002320001000000000"}

  Usuario: "Juan Pérez"
  Respuesta: {"contribuyente":"Juan Pérez"}

  Usuario: "Barrios exactos Centro que sí pagaron"
  Respuesta: {"nombreExacto":"Centro","estado":"pagado","campo":"Barrio"}

  Usuario: "Quiero buscar datos de Pradera"
  Respuesta: {"nombreIncluye":"Pradera","campo":"Todos"}

  Usuario: "Muestrame los que no han pagado en el sector Sur"
  Respuesta: {"estado":"no pagado","nombreIncluye":"Sur","campo":"Todos"}

  Usuario: "Buscar predios con avaluo entre 100000 y 200000"
  Respuesta: {"valorEntre":[100000,200000],"campo":"Avaluo"}

  Usuario: "Impuesto mayor a 500000"
  Respuesta: {"valorMin":500000,"campo":"Valor"}

  `
}
function filtrarZonas(zonas, filtros, diccionarioFiltros) {

  return zonas.filter(z => {
    for (const [filtro, valor] of Object.entries(filtros)) {

      if (valor === undefined || valor === null || valor === "") continue
      const campos = diccionarioFiltros[filtro]
      if (!campos) continue

      switch (filtro) {
        // ---------------- ESTADOS BOOLEANOS ----------------
        case "estado": {
          const esperado = valor === "pagado"
          if (z[campos] !== esperado) return false
          break
        }

        case "incluyeEstado": {
          const esperado = valor === "pagado"
          if (z[campos] !== esperado) return false
          break
        }

        case "excluido":
        case "excento": {
          if (z[campos] !== valor) return false
          break
        }

        // ---------------- NUMÉRICOS ----------------
        case "valorMin": {
          let listaCampos = campos
          if (filtros.campo && (filtros.campo === "Valor" || filtros.campo === "Avaluo")) {
            listaCampos = [filtros.campo]
          }
          if (!listaCampos.some(campo => Number(z[campo]) >= valor)) return false
          break
        }

        case "valorMax": {
          let listaCampos = campos
          if (filtros.campo && (filtros.campo === "Valor" || filtros.campo === "Avaluo")) {
            listaCampos = [filtros.campo]
          }
          if (!listaCampos.some(campo => Number(z[campo]) <= valor)) return false
          break
        }

        case "valorEntre": {
          const [min, max] = valor
          let listaCampos = campos
          if (filtros.campo && (filtros.campo === "Valor" || filtros.campo === "Avaluo")) {
            listaCampos = [filtros.campo]
          }
          if (!listaCampos.some(campo =>
            Number(z[campo]) >= min && Number(z[campo]) <= max
          )) return false
          break
        }


        // ---------------- TEXTO ----------------
        case "nombreIncluye":
          if (!campos.some(campo =>
            String(z[campo] || "")
              .toLowerCase()
              .includes(String(valor).toLowerCase())
          )) return false
          break

        case "nombreExacto":
          if (!campos.some(campo =>
            String(z[campo] || "").toLowerCase() === String(valor).toLowerCase()
          )) return false
          break

        case "excluirNombre":
          if (campos.some(campo =>
            String(z[campo] || "")
              .toLowerCase()
              .includes(String(valor).toLowerCase())
          )) return false
          break

        // ---------------- CAMPOS ESPECÍFICOS ----------------
        case "identificacion":
          if (String(z.Identificacion).trim() !== String(valor).trim()) return false
          break

        case "contribuyente":
          const contrib = z.Contribuyente?.toLowerCase() || ''

          const contribPalabras = contrib.split(/\s+/).filter(Boolean)
          const valorPalabras = valor.split(/\s+/).filter(Boolean)
          const coincideParcial = contrib.includes(valor) || valor.includes(contrib)
          const coincidePalabras = valorPalabras.every(p =>
            contribPalabras.includes(p)
          )

          if (!(coincideParcial || coincidePalabras)) return false
          break

        case "fichaFinal":
          if (String(z.FichaFinal || "").trim() !== String(valor).trim()) return false
          break

        case "campo":
          // aquí “campo” solo es un modificador → lo maneja nombreIncluye/exacto
          break
      }
    }
    return true
  })
}
const aplicarFiltros = async (filtros) => {

  let resultado = filtrarZonas([...zonasBase.value], filtros, diccionarioFiltros)

  zonas.value = []
  limpiarMapaCompleto()

  zonas.value = [...resultado]

  const infoWindow = new google.maps.InfoWindow()

  zonas.value.forEach(zona => {

    if (!zona.WktLista) return
    const listaPoligonos = []
    const anillos = agruparPorNivelAnillo(zona.WktLista)
    const color = zona.IsPago ? '#2563eb' : '#FF4B33'

    anillos.forEach(({ outer, holes }) => {
      const poligono = new google.maps.Polygon({
        paths: [outer, ...holes],
        strokeColor: color,
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0,
        clickable: true,
        map
      })

      poligono.addListener('click', e => {
        infoWindow.setContent(buildInfoHtml(zona))
        infoWindow.setPosition(e.latLng)
        infoWindow.open({ map })
      })

      listaPoligonos.push(poligono)
    })
    poligonosPorFicha.set(zona.FichaFinal, listaPoligonos)
  })

  if (zonas.value.length > 0 && Array.isArray(zonas.value[0].WktLista)) {
    const anillos = agruparPorNivelAnillo(zonas.value[0].WktLista);

    const primerOuter = anillos.find(a => a.outer && a.outer.length > 0);

    if (primerOuter) {
      const punto = primerOuter.outer[0];
      const centro = { lat: punto.lat, lng: punto.lng };
      map.setCenter(centro);
      map.setZoom(16)
    }
  }

  renderizarGraficoQuienesPagaron()

  Utils.loadingNotify(false, '')
}
const limpiarRespuestaAI = (result) => {
  const limpio = result.replace(/```json|```/g, '').trim()
  try {
    return JSON.parse(limpio)
  } catch (e) {
    console.warn("No se pudo parsear JSON:", limpio)
    return null
  }
}
const procesarMensaje = async () => {
  if (!filtroAI.value) return

  Utils.loadingNotify(true, 'Procesando consulta...')

  try {
    const prompt = construirPrompt()
    const mensaje = [
      { "role": "system", "content": prompt },
      { "role": "user", "content": filtroAI.value }
    ]

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer 1igCIkiiLMN6DFoYbSksww0qg0ss4u8f` // o tu variable de entorno
      },
      body: JSON.stringify({
        model: "mistral-small-2503", // puedes cambiar a mistral-7b si quieres más rápido
        messages: mensaje
      })
    })

    Utils.loadingNotify(false, '')

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Error API: ${response.status} - ${text}`)
    }

    const data = await response.json()

    // Extraemos el contenido generado
    const dato = data?.choices?.[0]?.message?.content
    if (!dato) throw new Error('No se recibió respuesta del modelo')

    const datos = limpiarRespuestaAI(dato)

    if (Object.keys(datos).length === 0) {
      Utils.notificacion('No se encontraron datos con el filtro aplicado', null)
    } else {
      aplicarFiltros(datos)
    }


  } catch (err) {
    Utils.loadingNotify(false, '')
    Utils.notificacion('Error al procesar la consulta: ' + err.message, false)
  }
}
window.addEventListener('message', (event) => {
  console.log('EVENTO')
  if (event.data.accion === 'terminado') {
    procesarPDFZona(event.data.ficha);
  }
});
const procesarPDFZona = async (predio) => {

  Utils.loadingNotify(true, 'Consultando ...')

  let dato = { unCompania: "49", unPredio: predio.Id, user: "SOPORTETOL" }

  const response = await fetch(
    'https://tol.sysman.com.co/sysman-erp-servicio-tol/servicio/predial/generarfactura',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer TU_TOKEN'
      },
      body: JSON.stringify(dato)
    }
  )

  Utils.loadingNotify(false, '')
  const data = await response.json()
  if (data.codigo && data.codigo != 0) {
    Utils.notificacion(data.mensaje, null)
  } else {
    const byteCharacters = atob(data.cuerpo.factura)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    const blob = new Blob([byteArray], { type: 'application/pdf' })
    const blobURL = URL.createObjectURL(blob)

    Utils.loadingNotify(false, '')

    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = blobURL

    document.body.appendChild(iframe)

    iframe.onload = () => {
      iframe.contentWindow.print()
    }
  }
}

// Rengos de impuesto

async function guardarRango() {
  const { Minimo, Maximo, Color, Tipo } = rango.value

  if (!Color) {
    Utils.notificacion('El color es obligatorio', null)
    return
  }

  if (Minimo >= Maximo) {
    Utils.notificacion('El mínimo debe ser menor que el máximo', null)
    return
  }

  // Formatea en K y M
  const redondearNumeroAMillones = (numero) => {
    if (numero >= 1_000_000) {
      return `${Math.floor(numero / 1_000_000)}M`
    }
    if (numero >= 1_000) {
      return `${Math.floor(numero / 1_000)}K`
    }
    return `${numero}`
  }

  const nuevoRango = {
    key: `${redondearNumeroAMillones(Minimo)} - ${redondearNumeroAMillones(Maximo)}`,
    min: Minimo,
    max: Maximo,
    color: Color
  }


  const lista = Tipo === 2 ? [...RANGOS_AVALUO.value] : [...RANGOS_IMPUESTO.value]

  // Devuelve true si [minimo,maximo] queda totalmente dentro de algún rango de lista
  const estaDentroDeAlguno = (minimo, maximo, lista) => {
    minimo = Number(minimo)
    maximo = Number(maximo)
    if (Number.isNaN(minimo) || Number.isNaN(maximo)) throw new Error('Minimo o Maximo no son números')
    if (minimo > maximo) [minimo, maximo] = [maximo, minimo] // normaliza si vienen invertidos

    return lista.some(r => {
      const rmin = Number(r.min)
      const rmax = Number(r.max)
      return minimo >= rmin && maximo <= rmax
    })
  }

  // uso
  if (estaDentroDeAlguno(Minimo, Maximo, lista)) {
    Utils.notificacion('El rango de valor ya existe', null)
    return
  }

  const idx = lista.findIndex(r => r.key === nuevoRango.key)
  if (idx >= 0) {
    lista[idx] = { ...nuevoRango }
  } else {
    lista.push({ ...nuevoRango })
  }

  if (Tipo === 2) {
    RANGOS_AVALUO.value = lista
    await instancia.setItem("rangosAvaluo", JSON.parse(JSON.stringify(RANGOS_AVALUO.value)))
  } else {
    RANGOS_IMPUESTO.value = lista
    await instancia.setItem("rangosImpuesto", JSON.parse(JSON.stringify(RANGOS_IMPUESTO.value)))
  }


  rango.value.Minimo = 0
  rango.value.Maximo = 0
  rango.value.Color = null
}
async function eliminarFila(row) {
  if (rango.value.Tipo === 2) {

    const lista = RANGOS_AVALUO.value.filter(r => r.key !== row.key)
    RANGOS_AVALUO.value = lista
    await instancia.setItem("rangosAvaluo", JSON.parse(JSON.stringify(RANGOS_AVALUO.value)))
  } else {

    const lista = RANGOS_IMPUESTO.value.filter(r => r.key !== row.key)
    RANGOS_IMPUESTO.value = lista
    await instancia.setItem("rangosImpuesto", JSON.parse(JSON.stringify(RANGOS_IMPUESTO.value)))
  }
}

const mostrarEnMapaZonas = async () => {
  isCrearRangosMapa.value = false
  renderizarMapaConfiltro(rango.value.Tipo != 2 ? 3 : 2)
}

// Funcion de lineas para mapa

// const traerLineasRutasPoligono = async () => {
//   const response = await api.get('presupuesto/inicio/datos-filtro-poligono-ruta')
//   lineasPoligonos.value = response.data

//   const carpetasUnicas = response.data.reduce((acc, linea) => {
//     const { Carpeta } = linea

//     if (!acc[Carpeta]) {
//       acc[Carpeta] = {
//         id: Carpeta,
//         label: Carpeta,
//         Carpeta
//       }
//     }
//     return acc
//   }, {})



//   lineasPoligonosAgrupadasArbol.value = [
//     {
//       id: 'root',
//       label: 'Carpeta rutas',
//       Carpeta: 'Carpeta rutas',
//       children: Object.values(carpetasUnicas)
//     }
//   ]
// }


const traerLineasRutasPoligono = async () => {
  const response = await api.get('presupuesto/inicio/datos-filtro-poligono-ruta')
  lineasPoligonos.value = response.data

  // Agrupar carpetas y sus lineas por Nombre
  const carpetasUnicas = response.data.reduce((acc, linea) => {
    const { Carpeta, Nombre, Zona } = linea

    if (!acc[Carpeta]) {
      acc[Carpeta] = {
        id: Carpeta,
        label: Carpeta,
        Carpeta,
        children: []
      }
    }

    // Cada línea queda como hijo
    acc[Carpeta].children.push({
      id: `${Carpeta}-${Nombre}`, // id único por carpeta+nombre
      label: Nombre,
      Carpeta,
      Nombre,
      Zona
    })

    return acc
  }, {})

  lineasPoligonosAgrupadasArbol.value = [
    {
      id: 'root',
      label: 'Carpeta rutas',
      Carpeta: 'Carpeta rutas',
      children: Object.values(carpetasUnicas)
    }
  ]
}


const parseLineString = (wkt) => {
  if (!wkt || typeof wkt !== 'string') return []
  const inner = wkt.replace(/^LINESTRING\s*\(/i, '').replace(/\)\s*$/i, '').trim()
  if (!inner) return []

  return inner
    .split(',')
    .map(pair => {
      const parts = pair.trim().split(/\s+/)
      if (parts.length < 2) return null
      const [lngStr, latStr] = parts
      const lng = parseFloat(lngStr)
      const lat = parseFloat(latStr)
      return isNaN(lat) || isNaN(lng) ? null : { lat, lng }
    })
    .filter(Boolean)
}
const parseLineStrings = (wkts) => {
  if (!Array.isArray(wkts)) wkts = [wkts]
  return wkts.map(w => parseLineString(w))
}
const guardarCambioColor = () => {
  const ticked = tickedPoligonos.value[0]
  if (!ticked) return

  const carpetaSeleccionada = ticked.split('-')[0]

  const hijosDeCarpeta = lineasPoligonosAgrupadasArbol.value[0].children
    .find(c => c.id === carpetaSeleccionada)?.children || []

  for (const hijo of hijosDeCarpeta) {
    const index = coloresRango.value.findIndex(c => c.id === hijo.id)
    if (index >= 0) {
      coloresRango.value[index].color = colorSeleccionado.value
    } else {
      coloresRango.value.push({
        id: hijo.id,
        color: colorSeleccionado.value
      })
    }
  }

  Utils.notificacion(`Color aplicado a todos los hijos de ${carpetaSeleccionada}`, null)
  renderizarLineaRutas()
  colorSeleccionado.value = '#000000'
}



let polylinesDibujadas = []

watch(tickedPoligonos, () => {
  renderizarLineaRutas()
})
const carpetasSeleccionadas = computed(() => {
  const hijos = tickedPoligonos.value
  const carpetas = hijos
    .map(id => id.split('-')[0])
  return [...new Set(carpetas)]
})
const renderizarLineaRutasCompleta = () => {
  renderizarLineaRutas()
  isMostrarOpcionesRuta.value = false
}
const renderizarLineaRutas = () => {

  for (const poly of polylinesDibujadas) {
    poly.setMap(null)
  }
  polylinesDibujadas.length = 0

  for (const idSeleccionado of tickedPoligonos.value) {
    const nodo = lineasPoligonosAgrupadasArbol.value[0].children
      .flatMap(c => c.children)
      .find(h => h.id === idSeleccionado)

    if (!nodo) continue

    const { Carpeta, Nombre } = nodo
    const colorConfig = coloresRango.value.find(c => c.id === idSeleccionado)
    const color = colorConfig ? colorConfig.color : '#000000'

    const linea = lineasPoligonos.value.find(
      l => l.Carpeta === Carpeta && l.Nombre === Nombre
    )
    if (!linea) continue

    const paths = parseLineStrings(linea.Zona)
    if (!paths.length) continue

    for (const path of paths) {
      const polyline = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map
      })

      const info = new google.maps.InfoWindow({
        content: `
          <div style="font-size:14px;font-weight:bold">
            Carpeta: ${Carpeta}<br>
            Nombre: ${Nombre}
          </div>`
      })

      polyline.addListener('click', e => {
        info.setPosition(e.latLng)
        info.open(map)
      })

      polylinesDibujadas.push(polyline)
    }
  }


}

 

onBeforeMount(async () => {

  await traerLineasRutasPoligono()

  const datos = await obtenerDatos()

  if (datos.zonas && datos.zonas.length > 0) {
    cargarMapaInicial(datos.zonas)
  }

  if (datos.rangosAvaluo && datos.rangosAvaluo.length > 0) {
    RANGOS_AVALUO.value = datos.rangosAvaluo
  }

  if (datos.rangosImpuesto && datos.rangosImpuesto.length > 0) {
    RANGOS_IMPUESTO.value = datos.rangosImpuesto
  }
})
</script>
