import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "src/app/interfaces/user/user";
import { UserData } from "src/app/services/storage/user-data";
import { isNullOrUndefined, isNumber } from "util";
import { ToastService } from "src/app/services/toast.service";
import { PollAnswered } from "src/app/interfaces/poll/pollAnswered";
import { CoreService } from "src/app/services/core.service";
import {
  NavController,
  LoadingController,
  ModalController,
  Platform,
} from "@ionic/angular";
import { ApiService } from "src/app/services/api/api.service";
import { Wallet } from "src/app/interfaces/wallet/wallet";
import { InstitutionCategories } from "src/app/interfaces/institution/institutionCategories";
import { Configuration } from "src/app/interfaces/poll/configuration/configuration";
import { DetailRewardPage } from "../detail-reward/detail-reward.page";
import { Subscription } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: "app-tab-home",
  templateUrl: "./tab-home.page.html",
  styleUrls: ["./tab-home.page.scss"],
})
export class TabHomePage implements OnInit, OnDestroy {
  public slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  public user: User;
  public pollSaved: PollAnswered;
  public progressPoll: number = 0;
  public illustrationHome: string;
  public random: string;
  public wallet: Wallet[];
  public costTotal: number = 0;
  public costClaimed: number = 0;
  public rewardsTotal: number = 0;
  public rewardsClaimed: number = 0;
  public listRewardsClaimed: Wallet[] = [];
  public listRewardsToClaim: Wallet[] = [];
  public institutionsCategory: InstitutionCategories[];
  public categoriesURI: { name: string; url: string }[];
  public uriLogo: string;
  public configPolls: Configuration[];
  private backButtonSub: Subscription;

  public filterCategory: Array<InstitutionCategories>;
  public filterReward: Array<InstitutionCategories>;
  public filterPoll: Array<InstitutionCategories>;

  constructor(
    private userData: UserData,
    private toast: ToastService,
    private core: CoreService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private api: ApiService,
    private modalController: ModalController,
    private platform: Platform,
    private router: Router,
  ) {}

  /* ****************************** NgOnInit: Cargar los métodos para que funcione esta tab-home ****************************** */
  async ngOnInit() {
    //Check cambios
    this.listenForLoginEvents();

    /* Check objetos de interfaz */
    this.checkTheme();
    this.uriLogo = this.core.getLogoHomeToolbar();

    /* Check User*/
    this.user = await this.userData.getUser();
    if (!isNullOrUndefined(this.user)) {
      this.getProgressPoll();
      this.reviewImg();
      this.getWallet();
      this.getTypePolls();
      this.getTypeRewards();
      this.getCategories();
      this.categoriesURI = this.core.getCategoriesNamesURI();
      this.configPolls = await this.getConfigurationsTop();
    } else {
      await this.toast.openToast(
        "Usuario no encontrado, ingrese nuevamente",
        "danger"
      );
      
      this.router.navigate(['/'], {replaceUrl:true});
    }
  }

  ngOnDestroy(): void {
  }

  /* ****************************** Métodos que consumen api's ****************************** */

  async getConfigurationsTop(): Promise<any> {
    let configuration = null;
    const token = await this.userData.getToken();
    configuration = await this.api
      .getAll("configurations/top?wallets.email=" + this.user.email, token)
      .toPromise()
      .catch(async (error) => {
        let errorMessage = this.core.errorMessages(error);
        await this.toast.openToast(errorMessage, "danger");
      });
    //Cargando rewards en el configPoll
    if (!isNullOrUndefined(configuration)) {
      configuration.map((item) => {
        this.api.getAll("rewards/" + item.reward.id, token).subscribe(
          async (resp) => {
            item.reward = resp;
            item.favorite = false;

            let favoriteConfigPoll: Configuration[] = [];
            favoriteConfigPoll = await this.userData.getFavoriteConfigurationPoll();
            if (!isNullOrUndefined(favoriteConfigPoll)) {
              const hasFavorite = favoriteConfigPoll.some(
                (value) => value.config.id == item.config.id
              );
              if (hasFavorite) {
                item.favorite = true;
              }
            }
            return item;
          },
          (err) => {
            console.log(err);
            item.favorite = false;
            item.reward = item.reward;
            return item;
          }
        );
      });
    }
    return configuration;
  }

  async getWallet() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    this.api.getAll("wallets?user=" + this.user.id, token).subscribe(
      (res) => {
        this.wallet = res;
        this.cleanListRewardsClaimedAndToClaim();
        this.prepareRewards(res);
        loading.dismiss();
      },
      async (error) => {
        loading.dismiss();
      }
    );
  }

  async getWalletNotEffectLoading() {
    const token = await this.userData.getToken();
    this.api.getAll("wallets?user=" + this.user.id, token).subscribe(
      (res) => {
        this.wallet = res;
        this.cleanListRewardsClaimedAndToClaim();
        this.prepareRewards(res);
      },
      async (error) => {
      }
    );
  }

  async getCategories() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    this.api.getAll("type-institutions", token).subscribe(
      (res) => {
        const institutionCategories = res;
        if (institutionCategories) {
          this.institutionsCategory = institutionCategories;
          this.filterCategory = institutionCategories;
        }
        loading.dismiss();
      },
      async (error) => {
        loading.dismiss();
        let errorMessage = this.core.errorMessages(error);
        await this.toast.openToast(errorMessage, "danger");
      }
    );
  }

  async getTypePolls() {
    const token = await this.userData.getToken();
    this.api.getAll("type-polls", token).subscribe(
      (res) => {
        const filterPoll = res;
        if (!isNullOrUndefined(filterPoll)) this.filterPoll = filterPoll;
      },
      async (error) => {
        console.log(error);
      }
    );
  }

  async getTypeRewards() {
    const token = await this.userData.getToken();
    this.api.getAll("type-rewards", token).subscribe(
      (res) => {
        const filterPoll = res;
        if (!isNullOrUndefined(filterPoll)) this.filterReward = filterPoll;
      },
      async (error) => {
        console.log(error);
      }
    );
  }

  /* ****************************** Manejadores de cambios ****************************** */
  listenForLoginEvents() {
    window.addEventListener("progress:poll", () => {
      this.getProgressPoll();
    });
    window.addEventListener("dark:theme", () => {
      this.checkTheme();
    });
    window.addEventListener("charge:configuration", async () => {
      this.configPolls = await this.getConfigurationsTop();
    });
    window.addEventListener("charge:wallet", async () => {
      this.getWalletNotEffectLoading();
    });
  }

  /* ****************************** Data a refrescar ****************************** */
  async doRefresh(event) {
    try {
      this.getProgressPoll();
      this.reviewImg();
      this.getWallet();
      this.getCategories();
      this.categoriesURI = this.core.getCategoriesNamesURI();
      this.configPolls = await this.getConfigurationsTop();
      event.target.complete();
    } catch (error) {
      event.target.complete();
      await this.toast.openToast("Error en el servidor", "danger");
    }
  }

  /* ****************************** Capturar el boton de Back ****************************** */
/*   ionViewDidEnter() {
    console.log("entro al home");
    if (this.platform.is("android")) {
      this.backButtonSub = this.platform.backButton.subscribe(async () => {
        const modal = await this.modalController.getTop();
        if (modal) modal.dismiss();
        else navigator["app"].exitApp();
      });
    }
  }

  ionViewWillLeave() {
    console.log("salió del home");
    if(!isNullOrUndefined(this.backButtonSub)) this.backButtonSub.unsubscribe();
  } */

  /* ****************************** Métodos varios ****************************** */

  getProgressPoll() {
    this.userData.getQuestions().then((val) => {
      this.pollSaved = val;
      console.log("Poll");
      
      console.log(this.pollSaved );
      

      if (this.pollSaved) {
        const totalAnswered = this.pollSaved.questions.length;
        const totalQuestions = this.pollSaved.pollQuestionsLength;
        this.progressPoll = Math.trunc((totalAnswered / totalQuestions) * 100);
      }
    });
  }

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

  continuePoll() {
    this.navCtrl.navigateForward(`encuesta/${this.pollSaved.configId}`);
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

  cleanListRewardsClaimedAndToClaim() {
    this.costTotal = 0;
    this.costClaimed = 0;
    this.rewardsTotal = 0;
    this.rewardsClaimed = 0;
    this.listRewardsClaimed = [];
    this.listRewardsToClaim = [];
  }

  prepareRewards(wallet) {
    if (!isNullOrUndefined(wallet)) {
      wallet.forEach((elementWallet) => {
        if (elementWallet.reward.name != "Ninguna") {
          if (elementWallet.claim) {
            this.costClaimed += elementWallet.reward.cost;
            this.rewardsClaimed++;
            this.listRewardsClaimed.push(elementWallet);
          } else {
            this.listRewardsToClaim.push(elementWallet);
          }
          this.rewardsTotal++;
          this.costTotal += elementWallet.reward.cost;
        }
      });
    }
  }

  async goToPollsCatagories(typeName){
    this.filterCategory.map((item)=>{
      if(item.name==typeName){
        item.isChecked = true;
      }else{
        item.isChecked = false;
      }
      return item;
    });
    
    const filterList = [
      { name: "Categoría", open: false, types: this.filterCategory },
      { name: "Tipo de recompensa", open: false, types: this.filterReward },
      { name: "Tipo de formulario", open: false, types: this.filterPoll },
    ];

    await this.userData.setFilters(filterList);
    
    this.navCtrl.navigateForward('tabs/encuestas');
  }

  validateUrlImgLocal(nameTypeInstitution: string) {
    let type = this.categoriesURI.find(
      (item) => item.name == nameTypeInstitution
    );
    return type.url;
  }

  async showDetails(index) {
    let modal = await this.modalController.create({
      component: DetailRewardPage,
      cssClass: "my-custom-modal-css",
      componentProps: {
        originPage: "tab-home",
        poolSelected: index,
        configPolls: this.configPolls,
      },
    });
   /*  modal.onDidDismiss().then((dataReturned) => {
      //if (!isNullOrUndefined(dataReturned.data))
        //this.backButtonSub.unsubscribe();
    }); */
    return await modal.present();
  }

  async addRemoveFavorite(index) {
    try {
      this.configPolls[index].favorite = !this.configPolls[index].favorite;
      let favoriteConfigPoll: Configuration[] = [];

      favoriteConfigPoll = await this.userData.getFavoriteConfigurationPoll();
      if (!isNullOrUndefined(favoriteConfigPoll)) {
        let indexFavorite = favoriteConfigPoll.findIndex(
          (val) => val.config.id == this.configPolls[index].config.id
        );
        if (indexFavorite > -1) {
          favoriteConfigPoll.splice(indexFavorite, 1);
        } else {
          favoriteConfigPoll.push(this.configPolls[index]);
        }
      } else {
        favoriteConfigPoll = [];
        favoriteConfigPoll.push(this.configPolls[index]);
      }
      await this.userData.setFavoriteConfigurationPoll(favoriteConfigPoll);
      window.dispatchEvent(new CustomEvent("charge:favorites"));
    } catch (error) {
      console.log(error);
    }
  }

  onErrorImg(img) {
    try {
      if (img.url) {
        return img.url;
      } else {
        return "../../../assets/img/temp_promo.jpg";
      }
    } catch (error) {
      return "../../../assets/img/temp_promo.jpg";
    }
  }

  onErrorImgInstitution(img) {
    try {
      if (img.url) {
        return img.url;
      } else {
        return "../../../assets/img/temp_empresa.jpg";
      }
    } catch (error) {
      return "../../../assets/img/temp_empresa.jpg";
    }
  }

  onErrorImgCategories(img) {
    try {
      if (img.url) {
        return img.url;
      } else {
        return "../../../assets/shapes.svg";
      }
    } catch (error) {
      return "../../../assets/shapes.svg";
    }
  }
}
