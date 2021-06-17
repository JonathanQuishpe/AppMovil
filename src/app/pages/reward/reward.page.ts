import { Component, OnInit } from "@angular/core";
import { NavController, LoadingController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api/api.service";
import { ToastService } from "src/app/services/toast.service";
import { UserData } from "src/app/services/storage/user-data";
import { User } from "src/app/interfaces/user/user";
import { isNullOrUndefined } from "util";
import { Reward } from "src/app/interfaces/wallet/reward";
import { Wallet } from "src/app/interfaces/wallet/wallet";

@Component({
  selector: "app-reward",
  templateUrl: "./reward.page.html",
  styleUrls: ["./reward.page.scss"],
})
export class RewardPage implements OnInit {
  public tokenReward: string;
  public user: User;
  public wallet: Wallet;
  public noReward: boolean;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private userData: UserData
  ) {
    this.tokenReward = this.route.snapshot.paramMap.get("token");
    this.noReward = this.tokenReward === "0";
  }

  async ngOnInit() {
    this.user = await this.userData.getUser();
    if (!this.noReward) this.handlerGetReward();
  }

  async handlerGetReward() {
    if (this.user) {
      this.wallet = await this.getReward();
    } else {
      this.wallet = await this.getPublicReward();
    }
  }

  toWallet() {
    this.navCtrl.navigateForward(`tabs/billetera`);
  }

  toHome() {
    this.navCtrl.navigateForward(`tabs/home`);
  }

  async getReward() {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    let reward = null;
    try {
      const token = await this.userData.getToken();
      reward = await this.api
        .getAll("wallets/" + this.tokenReward, token)
        .toPromise();
      await loading.dismiss();
    } catch (error) {
      await this.toast.openToast(error.error.message, "danger");
      await loading.dismiss();
    }
    return reward;
  }

  async getPublicReward() {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    let reward = null;
    try {
      reward = await this.api.getAll("wallets/" + this.tokenReward).toPromise();

      await loading.dismiss();
    } catch (error) {
      await this.toast.openToast(error.error.message, "danger");
      await loading.dismiss();
    }
    return reward;
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
}
