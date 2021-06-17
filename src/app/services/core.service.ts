import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CoreService {
  public random: string;
  public uriLogo: string;

  constructor() {}

  async avatarProfile() {
    this.random =
      "../assets/avatar/" + Math.round(Math.random() * 9 + 1) + ".png";
    return this.random;
  }

  getCategoriesNamesURI() {
    return [
      {
        name: "Automotriz",
        url: "../assets/img/category_institutions/automotriz.svg",
      },
      { name: "Bancos", url: "../assets/img/category_institutions/banca.svg" },
      {
        name: "Centro Comercial",
        url: "../assets/img/category_institutions/centroComercial.svg",
      },
      {
        name: "Deportes",
        url: "../assets/img/category_institutions/seportes.svg",
      },
      {
        name: "Educación",
        url: "../assets/img/category_institutions/educacion.svg",
      },
      {
        name: "Entretenimiento",
        url: "../assets/img/category_institutions/entretenimiento.svg",
      },
      {
        name: "Farmacias",
        url: "../assets/img/category_institutions/farmacias.svg",
      },
      {
        name: "Ferreterías",
        url: "../assets/img/category_institutions/ferreteria.svg",
      },
      {
        name: "Hospitales",
        url: "../assets/img/category_institutions/hospital.svg",
      },
      { name: "Moda", url: "../assets/img/category_institutions/moda.svg" },
      {
        name: "Muebles",
        url: "../assets/img/category_institutions/muebles.svg",
      },
      {
        name: "Papelería",
        url: "../assets/img/category_institutions/papeleria.svg",
      },
      {
        name: "Restaurantes",
        url: "../assets/img/category_institutions/restaurantes.svg",
      },
      {
        name: "Supermercados",
        url: "../assets/img/category_institutions/supermercado.svg",
      },
    ];
  }

  getLogo(): string {
    return "../assets/icon/boo.svg";
  }

  getLogoHomeToolbar(): string {
    return "../assets/icon/boo-toolbar.svg";
  }

  getLogoContrast(): string {
    return "../assets/icon/boo-contrast.svg";
  }

  getIllustrationHome(isDarkTheme: boolean): string {
    return isDarkTheme
      ? "../assets/img/ilustracion_home_contrast.svg"
      : "../assets/img/ilustracion_home.svg";
  }

  dataURItoBlob(typeImg: string, dataURI) {
    console.log(dataURI);

    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/" + typeImg });
    return blob;
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  errorMessages(error): string {
    let message = "";
    if (error.status === 403) message = "No tiene acceso";
    if (error.status === 404) message = "La página que busca no existe";
    if (error.status === 500) message = "Error en el servidor";
    if (error.status === 0) message = "No se pudo conectar con el servidor";
    if (error.status === 400)
      message = error.error.data.message
        ? error.error.data.message
        : "Error en el servidor";
    return message;
  }

  handlerMenuUser(role: string){
    if(role === "User") return this.menuRegurlarUser();
    if(role === "Supervisor") return this.menuSupervisorUser();
    if(role === "Establecimiento") return this.menuEstablecimientoUser();
    return this.menuRegurlarUser();
  }

  menuEstablecimientoUser() {
    return [
      { icon: "business", name: "Establecimientos", url: "empresas" },

      {
        icon: "person",
        name: " Información personal",
        url: "informacion",
      },
      {
        icon: "navigate-circle",
        name: " Ubicación",
        url: "ubicacion",
      },
      {
        icon: "briefcase",
        name: " Perfil profesional",
        url: "user-professional-profile",
      },
      {
        icon: "cog",
        name: "Configuración",
        url: "user-configuration",
      },
      {
        icon: "help-circle",
        name: "Términos y condiciones",
        url: "user-politics",
      },
    ];
  }

  menuSupervisorUser() {
    return [
      { icon: "documents", name: "Agenda", url: "/tabs/perfil" },

      {
        icon: "person",
        name: " Información personal",
        url: "informacion",
      },
      {
        icon: "navigate-circle",
        name: " Ubicación",
        url: "ubicacion",
      },
      {
        icon: "briefcase",
        name: " Perfil profesional",
        url: "user-professional-profile",
      },
      {
        icon: "cog",
        name: "Configuración",
        url: "user-configuration",
      },
      {
        icon: "help-circle",
        name: "Términos y condiciones",
        url: "user-politics",
      },
    ];
  }

  menuRegurlarUser() {
    return [
      {
        icon: "person",
        name: " Información personal",
        url: "informacion",
      },
      {
        icon: "navigate-circle",
        name: " Ubicación",
        url: "ubicacion",
      },
      {
        icon: "briefcase",
        name: " Perfil profesional",
        url: "user-professional-profile",
      },
      {
        icon: "cog",
        name: "Configuración",
        url: "user-configuration",
      },
      {
        icon: "help-circle",
        name: "Términos y condiciones",
        url: "user-politics",
      },
    ];
  }
}
