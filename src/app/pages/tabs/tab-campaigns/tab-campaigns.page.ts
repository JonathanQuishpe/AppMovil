import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { UserData } from "src/app/services/storage/user-data";
import { ToastService } from "src/app/services/toast.service";
import { CoreService } from "src/app/services/core.service";
import {
  NavController,
  LoadingController,
  ModalController,
  Platform,
} from "@ionic/angular";
import { Router } from "@angular/router";
import { ConfigurationInstitution } from "src/app/interfaces/poll/configuration-institution/configurationInstitution";
import { isNullOrUndefined } from "util";
import { User } from "src/app/interfaces/user/user";
import { Institution } from "src/app/interfaces/institution/institution";

@Component({
  selector: "app-tab-campaigns",
  templateUrl: "./tab-campaigns.page.html",
  styleUrls: ["./tab-campaigns.page.scss"],
})
export class TabCampaignsPage implements OnInit {
  public configurations: ConfigurationInstitution[];
  public userInstitutions: Institution[];
  public user: User;
  public userInstitutionsComplete: Institution[];
  public automaticClose = true;

  constructor(
    private userData: UserData,
    private toast: ToastService,
    private core: CoreService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private api: ApiService,
    private modalController: ModalController,
    private platform: Platform,
    private router: Router
  ) {}

  async ngOnInit() {
    /* Check User*/
    this.user = await this.userData.getUser();
    if (!isNullOrUndefined(this.user)) {
      this.userInstitutions = this.user.institutions;
      this.getConfigurationsOfInstitutions();
    } else {
      await this.toast.openToast(
        "Usuario no encontrado, ingrese nuevamente",
        "danger"
      );
      this.navCtrl.navigateForward("/");
    }
  }

  
  toggleSection(index) {
    this.userInstitutionsComplete[index].open = !this.userInstitutionsComplete[index].open;

    if (this.automaticClose && this.userInstitutionsComplete[index].open) {
      this.userInstitutionsComplete
        .filter((item, itemIndex) => itemIndex != index)
        .map((item) => (item.open = false));
    }
  }


  async getConfigurationsOfInstitutions() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();

    this.userInstitutionsComplete = [];
    for await (const institution of this.userInstitutions) {
      const config: any = await this.api
        .getAll("configurations?institution=" + institution.id, token)
        .toPromise()
        .catch();

      if (config) {
        institution.configuration = config;
        this.userInstitutionsComplete.push(institution);
      }
    }
    console.log(this.userInstitutionsComplete);
    
    loading.dismiss();

    /* await this.asyncForEach(this.userInstitutions, (item, index) => {
      this.api
        .getAll("configurations?institution=" + item.id, token)
        .subscribe((res: any) => {
          this.userInstitutions[index].configurations = res;
          this.userInstitutionsComplete.push(this.userInstitutions[index]);
          if(this.userInstitutions.length === index+1){
            loading.dismiss();
          }
        });
    }); */
  }

  async getBranchOffices() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();

    this.userInstitutionsComplete = [];

    for await (const institution of this.userInstitutions) {
      const branch: any = await this.api
        .getAll("institutions/" + institution.id, token)
        .toPromise()
        .catch();

      if (branch) {
        this.userInstitutionsComplete.push(branch);
      }
    }
    loading.dismiss();
  }

  goToStatistics(indexInstitution, indexConfig){
    
    const configId = this.userInstitutionsComplete[indexInstitution].configuration[indexConfig].id;
    console.log(configId);
    
    this.navCtrl.navigateForward('informacion/'+configId);

   /*  this.navCtrl.navigateForward(`statistics/${this.userInstitutionsComplete[indexInstitution].configuration[indexConfig].id}/${this.userInstitutionsComplete[indexInstitution].configuration[indexConfig].name}/${this.userInstitutionsComplete[indexInstitution].name}`); */
    
  }

  onErrorImg(img) {
    try {
      if (img.url) {
        return img.url;
      } else {
        return "../../../assets/img/temp_empresa.png";
      }
    } catch (error) {
      return "../../../assets/img/temp_empresa.png";
    }
  }

  numberOfConfig(config): string {
    try {
      if (config.length === 0) return "Sin estudios establecidos";
      if (config.length === 1) return "1 Estudio";
      if (config.length > 1) return (config.length) + " Estudios";
    } catch (error) {}
    return "Sin estudios establecidos";
  }
  
}
