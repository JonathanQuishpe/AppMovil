import { Component, OnInit } from "@angular/core";
import { ToastService } from "src/app/services/toast.service";
import { CoreService } from "src/app/services/core.service";
import { isNullOrUndefined, isNumber } from "util";
import { User } from "src/app/interfaces/user/user";
import { UserData } from "src/app/services/storage/user-data";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-tab-home-institution",
  templateUrl: "./tab-home-institution.page.html",
  styleUrls: ["./tab-home-institution.page.scss"],
  providers: [CoreService],
})
export class TabHomeInstitutionPage implements OnInit {
  public uriLogo: string;
  public user: User;
  public random: string;
  public illustrationHome: string;

  constructor(
    private toast: ToastService,
    private core: CoreService,
    private userData: UserData,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    /* //Check cambios
    this.listenForLoginEvents(); */

    /* Check objetos de interfaz */
    this.checkTheme();
    this.uriLogo = this.core.getLogoHomeToolbar();

    /* Check User*/
    this.user = await this.userData.getUser();
    
    if (this.user) {
      this.reviewImg();
    } else {
      await this.toast.openToast(
        "Usuario no encontrado, ingrese nuevamente",
        "danger"
      );
      this.navCtrl.navigateForward("/");
    }
  }
  /* ****************************** Manejadores de cambios ****************************** */
  /*listenForLoginEvents() {
    /* window.addEventListener("progress:poll", () => {
      this.getProgressPoll();
    });
    window.addEventListener("dark:theme", () => {
      this.checkTheme();
    });
    window.addEventListener("charge:configuration", async () => {
      this.configPolls = await this.getConfigurationsHome();
    }); 
  }*/

  /* ****************************** Data a refrescar ****************************** */
  async doRefresh(event) {
    try {
      this.reviewImg();
      /*       this.getProgressPoll();
      this.reviewImg();
      this.getWallet();
      this.getCategories();
      this.categoriesURI = this.core.getCategoriesNamesURI();
      this.configPolls = await this.getConfigurationsHome(); */
      event.target.complete();
    } catch (error) {
      event.target.complete();
      await this.toast.openToast("Error en el servidor", "danger");
    }
  }
  
  /* toggleSection(index) {
    this.userInstitutions[index].open = !this.userInstitutions[index].open;
    if (this.automaticClose && this.userInstitutions[index].open) {
      this.userInstitutions
        .filter((item, itemIndex) => itemIndex != index)
        .map((item) => (item.open = false));
    }
  }

  async getBranchOffices() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    this.userInstitutions.filter((item, index) => {
      this.api.getAll("institutions/" + item.id, token).subscribe((resp) => {
        this.institutionsComplete.push(resp);

        loading.dismiss();
      });
    });
    // this.api.getAll("branch-offices/", token).subscribe(
    //   (resp) => {
    //     this.languages = resp;
    //     loading.dismiss();
    //   },
    //   (err) => {
    //     console.log(err);
    //     loading.dismiss();
    //   }
    // );
  }
  onErrorImg(img) {
    try {
      if (img.formats.thumbnail.url) {
        return img.formats.thumbnail.url;
      } else {
        return "../../../assets/img/temp_empresa.png";
      }
    } catch (error) {
      return "../../../assets/img/temp_empresa.png";
    }
  } */

  checkTheme() {
    this.userData.getTheme().then((val) => {
      const theme = val;
      if (!isNullOrUndefined(theme)) {
        this.illustrationHome = this.core.getIllustrationHome(
          theme === "dark" ? true : false
        );
      }
    });
  }

  reviewImg() {
    this.userData.getUser().then((user) => {
      try {
        if (
          isNumber(user.user_extra.image) ||
          isNullOrUndefined(user.user_extra.image)
        ) {
          this.chargeAvatar();
        } else {
          this.random = user.user_extra.image.url;
        }
      } catch (error) {
        this.chargeAvatar();
      }
    });
  }

  chargeAvatar() {
    this.core.avatarProfile().then((res) => {
      this.random = res;
    });
  }
}
