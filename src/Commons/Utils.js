import { Dialog, Loading, date } from "quasar";
import { LocalStorage } from "quasar";
import { api } from "src/boot/axios";
import { computed } from "vue";
const alertStack = [];
export default {
  confirmarAccion(mensaje, estado) {
    return new Promise((resolve) => {
      let elementoActivo = document.activeElement;
      const estados = {
        true: { tipo: "positive", color: "green", icon: "check" },
        false: { tipo: "negative", color: "red", icon: "close" },
        null: { tipo: "warning", color: "orange", icon: "warning" },
      };

      const { tipo, color, icon } = estados[estado] || {
        tipo: "info",
        color: "blue",
        icon: "info",
      };

      const dialogId = `dialog-${Date.now()}`;

      const dialogInstance = Dialog.create({
        dark: false,
        message: `
          <div id="${dialogId}" class="items-center col row q-gutter-xs justify-center">
            <i style="color: ${color}" class="q-mr-md q-icon material-icons text-h1 notranslate">${icon}</i>
            <p class="q-pa-xs justify-center text-subtitle1 text-center">${mensaje}</p>
          </div>
          <hr style="width: 100%; margin: 0; border: 1px solid lightgray;" />
        `,
        ok: {
          label: "Sí",
          autofocus: true,
          color: "green",
          textColor: "white",
        },
        html: true,
        style: {
          borderTop: `5px solid ${color}`,
        },
        cancel: {
          label: "No",
          color: "red-6",
          autofocus: false,
          textColor: "white",
        },
        persistent: true,
      });

      let currentFocus = 1;

      const keyListener = (event) => {
        const dialogElement = document.querySelector(`#${dialogId}`);
        if (!dialogElement) return;

        const buttons = dialogElement
          .closest(".q-dialog")
          .querySelectorAll(".q-btn");

        if (!buttons.length) return;

        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          buttons[currentFocus].style.opacity = "0.5"; // Reducir opacidad del botón actual
          currentFocus = (currentFocus + 1) % 2; // Cambiar índice del botón enfocado
          buttons[currentFocus].style.opacity = "1"; // Restaurar opacidad del nuevo botón enfocado
          buttons[currentFocus].focus(); // Enfocar el nuevo botón
        } else if (event.key === "Enter") {
          buttons[currentFocus].click();
        }
      };

      const initButtonsOpacity = () => {
        const dialogElement = document.querySelector(`#${dialogId}`);
        if (!dialogElement) return;

        const buttons = dialogElement
          .closest(".q-dialog")
          .querySelectorAll(".q-btn");
        if (!buttons.length) return;

        buttons.forEach((button, index) => {
          button.style.opacity = index === currentFocus ? "1" : "0.3"; // Opacidad basada en el índice
        });

        buttons[currentFocus].focus(); // Enfocar el botón inicial (segundo botón)
      };

      // Llamar a initButtonsOpacity después de que se cree el diálogo
      setTimeout(() => initButtonsOpacity(), 100);

      dialogInstance.onOk(() => {
        window.removeEventListener("keydown", keyListener);

        setTimeout(() => {
          const botonActivo = document.querySelector("button.q-btn:focus");
          if (botonActivo) {
            botonActivo.blur();
          }

          if (elementoActivo && elementoActivo.blur) {
            elementoActivo.blur();
          }

          const loadingDialog = document.querySelector(".q-loading__box");
          if (loadingDialog) {
            loadingDialog.setAttribute("tabindex", "-1"); // Hacer el elemento enfocable
            loadingDialog.focus();
          }
        }, 100);
        resolve(true);
      });

      dialogInstance.onCancel(() => {
        window.removeEventListener("keydown", keyListener);
        resolve(false);
      });
      window.addEventListener("keydown", keyListener);
    });
  },
  obtenerRespuestaPrompt: async (titulo) => {
    return new Promise((resolve) => {
      Dialog.create({
        title: titulo,
        prompt: {
          model: "",
          type: "text",
          required: true,
          okLabel: "Aceptar",
          cancelLabel: "Cancelar",
        },
      })
        .onOk((data) => {
          resolve(data);
          return data;
        })
        .onCancel(() => {
          resolve(true);
          return null;
        })
        .onDismiss(() => {
          resolve(true);
          return null;
        });
    });
  },
  regla: (val) => {
    if (val) {
      val = val.trim();
    }
    if (!val || val.length === 0) {
      return "Este campo es obligatorio. *";
    } else {
      return true;
    }
  },
  reglaFiles: (files) => {
    if (!files || files.length === 0) return "Debe seleccionar un archivo";

    // Revisar todos los archivos
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Verificar tipo de archivo
      if (file.type !== "application/pdf") {
        return "Solo se permiten archivos PDF";
      }

      // Verificar tamaño máximo (3 MB = 3 * 1024 * 1024 bytes)
      if (file.size > 3 * 1024 * 1024) {
        return "El archivo no puede superar los 3 MB";
      }
    }

    return true; // pasa la validación
  },
  reglaFilesNoObligatorio: (files) => {
    // Si no hay archivos, pasa la validación (no obligatorio)
    if (!files || files.length === 0) return true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar tipo de archivo
      if (file.type !== "application/pdf") {
        return "Solo se permiten archivos PDF";
      }

      // Validar tamaño máximo (3 MB)
      if (file.size > 3 * 1024 * 1024) {
        return "El archivo no puede superar los 3 MB";
      }
    }

    return true; // pasa la validación
  },
  reglaNumero(val) {
    if (val === null || val === undefined || val === "") {
      return "Este campo es obligatorio. *";
    }

    if (isNaN(val)) {
      return "Debe ser un número válido.";
    }

    const numero = parseFloat(val);
    if (numero < 0) {
      return "El número no puede ser menor que cero.";
    }

    return true;
  },
  reglaTexto(val) {
    if (!val || val.length === 0) {
      return "Este campo es obligatorio. *";
    }
    if (!/^[A-Za-z]+$/.test(val)) {
      return "Solo se permiten letras.";
    }
    return true;
  },
  reglaBloqueada: (val, estado) => {
    if (!estado && (!val || val.length === 0)) {
      return "Este campo es obligatorio.";
    } else {
      return true;
    }
  },
  reglaSelect: (val) => {
    if (val === null || val === undefined || val === "") {
      return "Este campo es obligatorio *";
    }
    return true;
  },
  verOpcionesCamara: async () => {
    return new Promise((resolve, reject) => {
      BottomSheet.create({
        message: "Opciones Camara",
        grid: true,
        actions: [
          {
            label: "Galeria",
            icon: "photo_library",
            id: "galeria",
          },
          {
            label: "Camara",
            icon: "photo_camera",
            id: "camara",
          },
        ],
      })
        .onOk((action) => {
          if (action.id === "camara") {
            resolve(1);
          }
          if (action.id === "galeria") {
            resolve(2);
          }
        })
        .onCancel(() => {
          resolve(null);
        });
    });
  },
  tomarFoto: async (tipo) => {
    return new Promise((resolve, reject) => {
      navigator.camera.getPicture(
        (data) => {
          resolve(`data:image/jpeg;base64,${data}`);
        },
        (error) => {
          reject(error);
        },
        {
          quality: 100,
          destinationType: 0,
          targetWidth: 1600,
          targetHeight: 1200,
          sourceType: tipo,
          encodingType: 0,
          saveToPhotoAlbum: false,
          correctOrientation: true,
        }
      );
    });
  },
  notificacion: async (mensaje, tipof) => {
    let tipo = (await tipof) ? "check_circle" : "warning";
    let color = (await tipof) ? "green" : "red";
    if (tipof === null) {
      tipo = "task_alt";
      color = "orange";
    }
    const mensajeF = `
      <div class="column items-center q-pa-md bg-white">
        <div class="q-mt-sm">
          <i style="color: ${color}" class="q-icon material-icons text-h2 notranslate" aria-hidden="true" role="img">${tipo}</i>
        </div>
        <div class="q-mt-sm text-subtitle1 text-blue-grey-9 text-center" style="max-width: 520px;">
          ${mensaje}
        </div>
      </div>
    `;
    Dialog.create({
      dark: false,
      message: mensajeF,
      icon: null,
      html: true,
      ok: {
        label: "Aceptar",
        color: "blue-grey-9",
        textColor: "white",
        unelevated: true,
      },
      style: {
        borderTop: `5px solid ${color}`,
      },
    });
  },

  notificacionLeve(mensaje, tipoFlag) {
    let icono = tipoFlag ? "check_circle" : "warning";
    let color = tipoFlag ? "green" : "red";

    if (tipoFlag === null) {
      icono = "task_alt";
      color = "orange";
    }

    if (!document.getElementById("toast-styles")) {
      const style = document.createElement("style");
      style.id = "toast-styles";
      style.textContent = `
        #toast-container {
          position: fixed;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 99999;
          pointer-events: none;
        }

        .toast-msg {
          background: white;
          border-radius: 8px;
          padding: 10px 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 260px;
          max-width: 380px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          opacity: 0;
          transition: opacity .25s, transform .25s;
          transform: translateY(-10px);
          pointer-events: all;
        }

        .toast-show {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }

    let contenedor = document.getElementById("toast-container");
    if (!contenedor) {
      contenedor = document.createElement("div");
      contenedor.id = "toast-container";
      document.body.appendChild(contenedor);
    }

    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerHTML = `
      <i class="material-icons" style="color:${color}; font-size:22px;">${icono}</i>
      <span style="color:#37474F; font-size:14px;">${mensaje}</span>
    `;

    contenedor.appendChild(toast);

    setTimeout(() => toast.classList.add("toast-show"), 20);

    setTimeout(() => {
      toast.classList.remove("toast-show");
      setTimeout(() => toast.remove(), 250);
    }, 2300);
  },

  showAlert(message, type = true) {
    // Buscar si ya existe
    const existing = alertStack.find((a) => a.message === message);

    if (existing) {
      existing.count++;
      return; // No mostrar de nuevo
    }

    // Nueva alerta → guardamos en stack y mostramos
    alertStack.push({ message, count: 1 });
    this.notificacionLeve(message, type);

    console.log("STACK:", alertStack);
  },

  darFormatofecha: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "DD/MM/YYYY");
  },
  darFormatoDate: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "YYYY-MM-DD");
  },
  darFormatoHoras: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "hh:mm:ss A");
  },
  darFormatoHorasCompleta: (horaCompleta) => {
    if (!horaCompleta) return "";
    const [hora, minuto] = horaCompleta.split(":");
    const fecha = new Date();
    fecha.setHours(Number(hora), Number(minuto), 0);
    return date.formatDate(fecha, "hh:mm A");
  },

  darFormatofechaConHoras: (fechaSinFormato) => {
    return date.formatDate(fechaSinFormato, "DD/MM/YYYY hh:mm:ss A");
  },
  datoUsuario: async () => {
    try {
      const empresaString = localStorage.getItem("usuarioLigthing");

      const jsonString = empresaString.startsWith("__q_objt|")
        ? empresaString.slice(9)
        : empresaString;

      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error al recuperar el usuario:", error);
      return null;
    }
  },
  datoEmpresa: async () => {
    try {
      const empresaString = localStorage.getItem("EmpresaSeleccionadaOneZip");
      if (!empresaString) return null;

      const jsonString = empresaString.startsWith("__q_objt|")
        ? empresaString.slice(9)
        : empresaString;

      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error al recuperar la empresa", error);
      return null;
    }
  },

  existePermiso: (permisos, codigo) => {
    let resultado = permisos.find((pe) => pe.Codigo == codigo);
    return resultado ? true : false;
  },
  datoPermiso: async (vista) => {
    try {
      const menustrin = localStorage.getItem("MenuOnezip");
      if (menustrin) {
        const jsonString = menustrin.replace(/^__q_objt\|/, "");
        let resultado = JSON.parse(jsonString);
        for (const menu of resultado) {
          const vistaEncontrada = menu.Vistas.find((v) => v.Nombre === vista);
          if (vistaEncontrada) {
            return vistaEncontrada.Permisos;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error al recuperar la empresa", error);
      return null;
    }
  },
  retornarMeses() {
    const meses = [
      { label: "Enero", value: 1 },
      { label: "Febrero", value: 2 },
      { label: "Marzo", value: 3 },
      { label: "Abril", value: 4 },
      { label: "Mayo", value: 5 },
      { label: "Junio", value: 6 },
      { label: "Julio", value: 7 },
      { label: "Agosto", value: 8 },
      { label: "Septiembre", value: 9 },
      { label: "Octubre", value: 10 },
      { label: "Noviembre", value: 11 },
      { label: "Diciembre", value: 12 },
    ];
    return meses;
  },
  formatoMoneda(valor, numeroLimite) {
    if (!valor) {
      return 0;
    }
    let numero = parseFloat(valor);
    if (numero == 0 || numero == null) {
      return 0;
    }
    if (!numeroLimite) {
      numeroLimite = 0;
    }
    numero = this.formatoMonedaNumero(valor, numeroLimite);
    numero = numero.toLocaleString("es-CO", {
      currency: "COP",
      minimumFractionDigits: numeroLimite,
    });
    return numero;
  },
  formatoMonedaNumero(valor, numeroDecimales) {
    try {
      valor = parseFloat(valor);
      if (valor === 0) {
        return 0;
      }
      // if(numeroDecimales == 0){
      //   return valor
      // }
      return Number(valor.toFixed(numeroDecimales));
    } catch (error) {
      console.error(`Ocurrio un error ${error.message},  valor => ${valor}`);
    }
  },
  aplicarFormula(producto, empresa) {
    const cantidad = producto.Cantidad;
    producto.Total = this.formatoMonedaNumero(
      cantidad * producto.Precio,
      empresa.NumeroDecimales
    );

    let valorConImpuesto = producto.Total;

    let totalImpuestos = 0;
    valorConImpuesto = this.formatoMonedaNumero(
      valorConImpuesto,
      empresa.NumeroDecimales
    );
    producto.Impuestos.map((item) => {
      let valorImpuesto = this.aplicarTasa(
        valorConImpuesto,
        item.Tasa,
        "I",
        empresa.IsRedondear
      ).Impuesto;
      totalImpuestos += valorImpuesto;
    });
    totalImpuestos = this.formatoMonedaNumero(
      totalImpuestos,
      empresa.NumeroDecimales
    );
    producto.ValorImpuesto = totalImpuestos;
    producto.ValorBase = valorConImpuesto - totalImpuestos;

    producto.ValorTotal = producto.ValorBase;
  },
  aplicarTasa(valor, porcentaje, tipo, decimales) {
    valor = parseFloat(valor);
    porcentaje = parseFloat(porcentaje);
    let resultado = 0;
    let impu = 0;

    if (tipo === "D") {
      resultado = (valor * porcentaje) / 100;
      resultado = (resultado * 100) / 100;
      this.formatoMonedaNumero(resultado, decimales);
      return resultado;
    } else if (tipo === "I") {
      const costoSinIva = valor / (1 + porcentaje / 100);
      resultado = (costoSinIva * 100) / 100;
      this.formatoMonedaNumero(resultado, decimales);
      impu = ((valor - resultado) * 100) / 100;
      this.formatoMonedaNumero(impu, decimales);

      return { Total: resultado, Impuesto: impu };
    } else {
      throw new Error(
        "Tipo no válido. Usa 'D' para descuento o 'I' para impuesto."
      );
    }
  },
  aplicarTasaImpuestos(valor, tasa, decimales) {
    if (valor == null) 0;
    let valorImpuesto = (valor * tasa) / 100;
    valorImpuesto = this.formatoMonedaNumero(valorImpuesto, decimales);
    return valorImpuesto;
  },

  loadingNotify: async (estado, mensaje) => {
    if (estado) {
      Loading.show({
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        spinnerSize: 0,
        boxClass: "bg-white text-grey-9 no-outline q-pa-md q-rounded-borders",
        message: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <svg width="160" height="160" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <!-- Fondo circular -->
          <circle cx="100" cy="100" r="80" fill="none" stroke="#007BFF" stroke-width="10" stroke-opacity="0.2" />
          
          <!-- Círculo animado -->
          <circle cx="100" cy="100" r="80" fill="none" stroke="#007BFF" stroke-width="10" stroke-dasharray="502" stroke-dashoffset="502">
            <animate attributeName="stroke-dashoffset" values="502;0" dur="1.2s" repeatCount="indefinite" />
          </circle>
          
          <!-- Inicial estilizada -->
          <text x="50%" y="120" font-family="Arial, sans-serif" font-size="60" fill="#007BFF" font-weight="bold" text-anchor="middle">
            LS
          </text>
        </svg>

        <p style="margin-top: 8px; font-size: 20px; color: #007BFF; font-weight: bold; letter-spacing: 1px;">
          Ligthing Services
        </p>

        <p class="q-mt-sm text-grey-8 text-body1 text-center" style="max-width: 200px;">
          ${mensaje}
        </p>
      </div>
      `,
        html: true,
      });

      // Evitar que se pueda navegar con TAB
      setTimeout(() => {
        const loadingDialog = document.querySelector(".q-loading__box");
        if (loadingDialog) {
          loadingDialog.setAttribute("tabindex", "-1");
          loadingDialog.addEventListener("keydown", (event) => {
            if (event.key === "Tab") {
              event.preventDefault();
            }
          });
        }
      }, 100);
    } else {
      Loading.hide();
    }
  },
  async cifrarTexto(texto, secretKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // IV de 12 bytes
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      secretKey,
      new TextEncoder().encode(texto)
    );

    const encryptedData = new Uint8Array(encrypted);
    const encryptedWithIV = new Uint8Array(iv.length + encryptedData.length);
    encryptedWithIV.set(iv);
    encryptedWithIV.set(encryptedData, iv.length);

    let binary = "";
    encryptedWithIV.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary);
  },
  async IncriptarClave(parametro) {
    const secretKey = await this.crearDecifrarClaveSecreta(true);
    const encryptedId = await this.cifrarTexto(parametro.toString(), secretKey);
    return encryptedId;
  },
  async DesIncriptarClave(encryptedText, key) {
    try {
      if (!/^[A-Za-z0-9+/=]+$/.test(encryptedText)) {
        throw new Error("Texto cifrado no está en formato Base64 válido");
      }

      const encryptedDataWithIV = new Uint8Array(
        atob(encryptedText)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      const iv = encryptedDataWithIV.slice(0, 12);
      const encryptedData = encryptedDataWithIV.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedData
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Error al descifrar la clave:", error);
      throw error;
    }
  },
  async crearDecifrarClaveSecreta(opcion) {
    const clave = "cpx{^;7ss#:4(4YC";
    const accionUtilizar = opcion ? "encrypt" : "decrypt";
    const secretKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(clave),
      { name: "AES-GCM" },
      false,
      [accionUtilizar]
    );
    return secretKey;
  },
  formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son base 0
    const anio = fecha.getFullYear();

    return `${dia}/${mes}/${anio}`;
  },
  formatearFechaHora(fechaString) {
    if (!fechaString) return "";

    const fecha = new Date(fechaString);

    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  },

  crearExcel(response, nombreArchivo) {
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = `Reporte ${nombreArchivo} ${date.formatDate(
      Date.now(),
      "DD-MM-YYYY HH:mm:ss"
    )}.xlsx`;
    link.click();
    URL.revokeObjectURL(blobURL);
  },
  creaPDF(response, nombreArchivo) {
    const blob = new Blob([response.data], { type: "application/pdf" });
    const blobURL = URL.createObjectURL(blob);

    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = `documento-${nombreArchivo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobURL;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.print();
      };
    }
  },
  formatearFechaLarga(fechaString) {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const opciones = { month: "long" }; // Para mostrar el mes en palabras
    const mes = new Intl.DateTimeFormat("es-ES", opciones).format(fecha);
    const anio = fecha.getFullYear();

    return `${dia} de ${mes} de ${anio}`;
  },
  TarifaPorGradoDian() {
    const ParametrosDian = {
      tarifa: 254,
      PresentacionEstandar: 750,
    };

    return ParametrosDian;
  },
  mensaje(texto) {
    this.notificacion(texto, null);
  },
  regla(val) {
    if (val !== undefined && val !== "" && val !== null) {
      return true;
    }
    return false || "Falta completar campo";
  },
  mensajeError(texto, posicion) {
    this.$q.notify({
      color: "negative",
      position: posicion === undefined ? "top" : posicion,
      message: texto,
      icon: "report_problem",
    });
  },
  mensajeConfirmacion(mensaje, html) {
    return new Promise((resolve) =>
      Dialog.create({
        title: "Neosage",
        dark: true,
        html: html,
        message: mensaje,
        cancel: true,
        persistent: true,
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
    );
  },
  validarFormulario(form) {
    return new Promise((resolve) =>
      form.validate().then((success) => {
        if (success) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    );
  },
  validarPeriodo(fecha, idEmpresa) {
    let vigencia = LocalStorage.getItem(
      `ConfiguracionPresupuesto${idEmpresa}`
    )?.replace("__q_strn|", "");

    let añoVigencia = new Date(vigencia + "T00:00:00").getFullYear();
    let añoFecha = new Date(fecha + "T00:00:00").getFullYear();

    if (añoVigencia !== añoFecha) {
      this.notificacion("Fecha diferente al periodo", false);
      return false;
    }

    return true;
  },
  traerVigencia(idEmpresa) {
    let vigenciaFecha = LocalStorage.getItem(
      `ConfiguracionPresupuesto${idEmpresa}`
    );
    let fechaString = vigenciaFecha.replace("__q_strn|", "");
    return parseInt(fechaString);
  },
  traerEntidad(idEmpresa) {
    let entidad = LocalStorage.getItem(
      `ConfiguracionPresupuesto${idEmpresa}-entidad`
    );
    let entidadString = entidad.replace("__q_strn|", "");
    return parseInt(entidadString);
  },
  fechaHoy() {
    return date.formatDate(new Date(), "YYYY-MM-DD");
  },
  fechaSistema() {
    return date.formatDate(new Date(), "YYYY-MM-DD");
  },
  formatoFecha(fecha, formato) {
    if (formato) {
      return date.formatDate(fecha, formato);
    }
    return date.formatDate(fecha, "DD/MM/YYYY");
  },
  construirDatoImpresoraPos: async (pedido, impresora) => {
    const MAX_CARACTERES = parseInt(impresora.Ancho);
    const ESPACIO_CANTIDAD = 7;
    const ESPACIO_DESCRIPCION = MAX_CARACTERES - ESPACIO_CANTIDAD;
    let lineaEspacio = "";
    for (let i = 2; i < MAX_CARACTERES; i++) {
      lineaEspacio += `-`;
    }
    let contenido = `[L]<font size='wide'>MODULO: ${pedido.Modulo}</font>[C][R]
  [L]<font size='small'>${pedido.Numero}</font>[C][R]
  [L]<font size='small'>Fecha: ${pedido.FechaCreacion}</font>[C][R]
  [L]<font size='small'>Zona: ${pedido.Zona}</font>[C][R]
  [L]<font size='small'>Atendido por: ${pedido.Empleado}</font>[C][R]
  [L]<font size='small'>Observacion: ${pedido.Observacion}</font> [C][R]`;
    contenido += "\n" + lineaEspacio + "\n";
    contenido += `CTN      DESCRIPCION`;
    contenido += "\n" + lineaEspacio + "\n";

    function dividirTexto(texto, limite) {
      let resultado = [];
      while (texto.length > limite) {
        resultado.push(texto.substring(0, limite));
        texto = texto.substring(limite);
      }
      resultado.push(texto);
      return resultado;
    }
    pedido.Productos.forEach((producto) => {
      let observacion = "";
      let especial = "";

      if (producto.Observaciones.length > 0) {
        producto.Observaciones.forEach((ob) => {
          observacion += `-${ob.Nombre}`;
        });
      }

      if (producto.IsInventarioEspecial) {
        producto.ListaInventarioEspecial.forEach((es) => {
          especial += `${es.Cantidad} => ${es.Nombre}, `;
        });
      }

      let nombreCompleto = `${producto.Nombre}`;
      let extras = [];

      if (observacion.length > 0) extras.push(observacion);
      if (producto.Observacion && producto.Observacion.length > 0)
        extras.push(producto.Observacion);
      if (especial.length > 0) extras.push(especial);

      if (extras.length > 0) {
        nombreCompleto += ` (${extras.join(" - ")})`;
      }

      let cantidad = producto.Cantidad.toString().padEnd(ESPACIO_CANTIDAD, " ");
      let lineasDescripcion = dividirTexto(nombreCompleto, ESPACIO_DESCRIPCION);

      contenido += `${cantidad}${lineasDescripcion[0]}\n`;
      for (let i = 1; i < lineasDescripcion.length; i++) {
        contenido += `       ${lineasDescripcion[i]}\n`;
      }

      contenido += lineaEspacio + "\n";
    });

    contenido += `\n \n \n \n \n \n`;
    return contenido;
  },
  imprimir(impresora, contenido) {
    const printOptions = {
      type: "tcp",
      address: impresora.Ip,
      port: impresora.Puerto,
      id: `tcp-printer-${impresora.Codigo}`,
      text: contenido,
      autoCut: true,
    };

    const disconnectOptions = {
      type: "tcp",
      address: impresora.Ip,
      port: impresora.Puerto,
      id: `tcp-printer-${impresora.Codigo}`,
    };

    return new Promise((resolve, reject) => {
      ThermalPrinter.printFormattedTextAndCut(
        printOptions,
        () => {
          console.log("¡Impresión exitosa!");
          ThermalPrinter.disconnectPrinter(
            disconnectOptions,
            () => {
              console.log("Conexión con impresora cerrada (buffer limpio)");
              resolve(true);
            },
            (errDisc) => {
              console.warn("Falló al desconectar impresora:", errDisc);
              resolve(true);
            }
          );
        },
        (errPrint) => {
          console.error(`Ocurrió un error al imprimir:`, errPrint);
          reject(errPrint);
        }
      );
    });
  },
  // imprimir(impresora, contenido) {

  //   let impresoraPrinter = ThermalPrinter({
  //     type: "tcp",
  //     address: impresora.Ip,
  //     port: impresora.Puerto,
  //     id: `tcp-printer-${impresora.Codigo}`,
  //     text: contenido,
  //     autoCut: true,
  //   })

  //   impresoraPrinter.printFormattedTextAndCut({})

  //   return new Promise((resolve, reject) => {
  //     ThermalPrinter.printFormattedTextAndCut(
  //       {
  //         type: "tcp",
  //         address: impresora.Ip,
  //         port: impresora.Puerto,
  //         id: `tcp-printer-${impresora.Codigo}`,
  //         text: contenido,
  //         autoCut: true,
  //       },
  //       () => {
  //         console.log("¡Impresión exitosa!");
  //         resolve(true);
  //       },
  //       (error) => {
  //         console.error(`Ocurrió un error al imprimir con el plugin: ${error}`);
  //         alert(`Ocurrió un error al imprimir: ${error.message || error}`);
  //         reject(false);
  //       }
  //     )
  //   })
  // },
  desconectarImpresora() {
    return new Promise((resolve, reject) => {
      ThermalPrinter.disconnectPrinter(
        {
          type: "tcp",
          address: impresora.Ip,
          port: impresora.Puerto,
          id: `tcp-printer-${impresora.Codigo}`,
          text: contenido,
          autoCut: true,
        },
        () => {
          console.log("¡Desconexión exitosa!");
          resolve(true);
        },
        (error) => {
          console.error(
            `Ocurrió un error al desconectar la impresora: ${error}`
          );
          alert(`Ocurrió un error al desconectar: ${error.message || error}`);
          reject(false);
        }
      );
    });
  },
  obtenerAnosAnteriores: (numeroAnos) => {
    let anoActual = new Date().getFullYear();
    return Array.from({ length: numeroAnos }, (_, index) => anoActual - index);
  },
  generarPdf: async (response, nombreArchivo) => {
    const blob = new Blob([response.data], { type: "application/pdf" });
    const blobURL = URL.createObjectURL(blob);

    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = `documento-${nombreArchivo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobURL;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.print();
      };
    }
  },

  generarPdfDocumentosRenta: async (response) => {
    const blob = new Blob([response.data], { type: "application/pdf" });
    const blobURL = URL.createObjectURL(blob);

    if (
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      const link = document.createElement("a");
      link.href = blobURL;
      // link.download = `documento-${nombreArchivo}.pdf`;
      link.download = `documento-nombreArchivo.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = blobURL;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow.print();
      };
    }
  },

  peticion: async (metodo, ruta, objeto = {}) => {
    try {
      const response = await (() => {
        switch (metodo.toUpperCase()) {
          case "GET":
            return api.get(ruta);
          case "POST":
            return api.post(ruta, { ...objeto });
          case "PUT":
            return api.put(ruta, { ...objeto });
          case "DELETE":
            return api.delete(ruta, { data: { ...objeto } });
          default:
            throw new Error("Método no soportado");
        }
      })();
      return response;
    } catch (error) {
      console.error(`Ocurrio un error inesperado` + error);
      return null;
    }
  },
  peticionMasiva: async (rutas) => {
    try {
      const response = await Promise.all(rutas.map((ruta) => api.get(ruta)));
      return response.map((res) => res);
    } catch (error) {
      console.error(`Ocurrió un error inesperado: ${error}`);
      return null;
    }
  },

  paginarTabla: (resultados, cantidadPagina) => {
    console.log(resultados, cantidadPagina);
    const totalResultados = resultados;
    const limites = [];

    for (let i = cantidadPagina; i <= totalResultados; i += cantidadPagina) {
      limites.push(i);
    }

    if (
      totalResultados % cantidadPagina !== 0 &&
      limites[limites.length - 1] !== totalResultados
    ) {
      limites.push(totalResultados);
    }
    // limites.push(0)
    return limites;
  },
  pagination: (cantidadPorPagina = 20) => {
    return {
      page: 1,
      rowsPerPage: cantidadPorPagina,
    };
  },
  totalesTabla: (util, lista, clave) =>
    computed(() => {
      let valor = lista.reduce((acc, n) => {
        let valorCampo = parseFloat(n[clave]) || 0;
        return acc + valorCampo;
      }, 0);
      valor = util.formatoMoneda(valor, 2);
      return valor;
    }),
};
