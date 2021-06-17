import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { ToastService } from "src/app/services/toast.service";
import {
  LoadingController,
  NavController,
  ModalController,
  Platform,
} from "@ionic/angular";
import { UserData } from "src/app/services/storage/user-data";
import { Wallet } from "src/app/interfaces/wallet/wallet";
import { isNullOrUndefined } from "util";
import { User } from "src/app/interfaces/user/user";
import { CoreService } from "src/app/services/core.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab-wallet",
  templateUrl: "./tab-wallet.page.html",
  styleUrls: ["./tab-wallet.page.scss"],
  providers: [UserData],
})
export class TabWalletPage implements OnInit, OnDestroy {
  public panelDetail: string;
  public wallet: Wallet[];
  public listRewardsClaimed: Wallet[] = [];
  public listRewardsToClaim: Wallet[] = [];
  public listExpiredPolls: Wallet[] = [];
  public user: User;
  public costTotal: number = 0;
  public costClaimed: number = 0;
  public rewardsTotal: number = 0;
  public rewardsClaimed: number = 0;
  public now: Date = new Date();
  public darkTheme: boolean;
  public illustrationHome: string;
  public today: Date;
  public todayString: string;

  private backButtonSub: Subscription;

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private userData: UserData,
    private navCtrl: NavController,
    private platform: Platform,
    private modalController: ModalController,
    private core: CoreService,
    private router: Router
  ) {}

  /* ****************************** NgOnInit: Cargar los métodos para que funcione esta tab-wallet ****************************** */
  async ngOnInit() {
    /* Check objetos de interfaz */
    this.checkTheme();

    //Check cambios
    this.listenForLoginEvents();

    /* Check User*/
    this.panelDetail = "abstractPanel"; //Panel por defecto

    this.today = new Date();
    this.todayString = this.today.toISOString().slice(0, 10);

    this.user = await this.userData.getUser();
    if (!isNullOrUndefined(this.user)) {
      //window.dispatchEvent(new CustomEvent("charge:configuration"));
      this.getWallet();
    } else {
      await this.toast.openToast(
        "Usuario no encontrado, ingrese nuevamente",
        "danger"
      );
      this.router.navigate(["/"], { replaceUrl: true });
    }
  }

  ngOnDestroy(): void {
    console.log("salio de wallet por destroy");
    if (!isNullOrUndefined(this.backButtonSub))
      this.backButtonSub.unsubscribe();
  }

  /* ****************************** Métodos que consumen api's ****************************** */
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
      async (error) => {}
    );
  }

  /* ****************************** Manejadores de cambios ****************************** */
  listenForLoginEvents() {
    window.addEventListener("dark:theme", () => {
      this.checkTheme();
    });
    window.addEventListener("charge:wallet", async () => {
      this.getWalletNotEffectLoading();
    });
  }

  /*  ionViewDidEnter() {
    console.log("entro wallet");
    if (this.platform.is("android")) {
      this.backButtonSub = this.platform.backButton.subscribe(async () => {
        const modal = await this.modalController.getTop();
        if (modal) {
          modal.dismiss();
        } else {
          let homeUrl =
            this.user.role.name === "Establecimiento"
              ? "tabs/home-establecimiento"
              : "tabs/home";
          this.router.navigate([homeUrl], { replaceUrl: true });
        }
      });
    }
  } */

  /* ionViewWillLeave() {
    console.log("salio wallet");
    if (!isNullOrUndefined(this.backButtonSub))
      this.backButtonSub.unsubscribe();
  } */

  /* ****************************** Métodos varios ****************************** */
  chargePanel(event: any) {
    this.panelDetail = event.detail.value;
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

  cleanListRewardsClaimedAndToClaim() {
    this.costTotal = 0;
    this.costClaimed = 0;
    this.rewardsTotal = 0;
    this.rewardsClaimed = 0;
    this.listRewardsClaimed = [];
    this.listRewardsToClaim = [];
  }

  async prepareRewards(wallet: Array<Wallet>) {
    if (wallet) {
      for await (const elementWallet of wallet) {
        if (elementWallet.reward.cost) {
          if (elementWallet.reward.cost != 0) {
            if (elementWallet.claim) {
              this.costClaimed += elementWallet.reward.cost;
              this.rewardsClaimed++;
              this.listRewardsClaimed.push(elementWallet);
            } else {
              const validityString = elementWallet.reward.validity.toString();
              console.log(Date.parse(validityString));
              console.log(Date.parse(this.todayString));
              
              if (Date.parse(validityString) >= Date.parse(this.todayString)) {
                this.listRewardsToClaim.push(elementWallet);
              } else {
                this.listExpiredPolls.push(elementWallet);
              }
            }
            this.rewardsTotal++;
            this.costTotal += elementWallet.reward.cost;
          }
        }
      }
    }

    /* if (wallet) {
      wallet.forEach((elementWallet) => {
        if(elementWallet.reward.cost){
          if (elementWallet.reward.cost != 0) {

            if (elementWallet.claim) {
              this.costClaimed += elementWallet.reward.cost;
              this.rewardsClaimed++;
              this.listRewardsClaimed.push(elementWallet);
            } else {
              if(elementWallet.reward.validity > today){
                this.listExpiredPolls.push(elementWallet);
              }
              this.listRewardsToClaim.push(elementWallet);
            }
            this.rewardsTotal++;
            this.costTotal += elementWallet.reward.cost;
          }
        }
      });
    } */
  }

  checkWallet(wallet) {
    try {
      if (wallet.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
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

  showReward(index) {
    this.navCtrl.navigateForward(
      `home/billetera/recompensa/${this.listRewardsToClaim[index].unique}`
    );
    /* this.router.navigate([`home/billetera/recompensa/${this.listRewardsToClaim[index].unique}`], {replaceUrl:true}); */
  }

  formatExpiredDate(validityString) {
    const differenceDates = Date.parse(validityString) - Date.parse(this.todayString);
    if (differenceDates == 0) return "hoy";
    if (differenceDates > 0){
      const differenceInDays = differenceDates/(1000*60*60*24);
      if(differenceInDays == 1) return "1 día";
      if(differenceInDays > 1 && differenceInDays < 30) return +differenceInDays+" días";
      
      if(differenceInDays >= 30){
        const differenceInMonths = Math.trunc(differenceInDays/30);
        if(differenceInMonths == 1) return "1 mes";
        if(differenceInMonths > 1) return differenceInMonths+" meses";
      }
    }
    return validityString;
  }

  labelExpiredDate(validityString){
    const differenceDates = Date.parse(validityString) - Date.parse(this.todayString);
    if (differenceDates == 0) return "Caduca";
    if (differenceDates > 0) return "Caduca en";
    return "";
  }

  colorExpiredLabel(validityString){
    const differenceDates = Date.parse(validityString) - Date.parse(this.todayString);
    if (differenceDates == 0) return "danger";
    if (differenceDates > 0){
      const differenceInDays = differenceDates/(1000*60*60*24);
      if(differenceInDays >= 1 && differenceInDays <= 7) return "warning";
    }
    return "success";
  }


}
