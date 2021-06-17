import { Component, OnInit, OnDestroy } from "@angular/core";
import { Platform, ModalController, NavController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { isNullOrUndefined } from "util";
import { User } from 'src/app/interfaces/user/user';
import { UserData } from 'src/app/services/storage/user-data';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-tab-user",
  templateUrl: "./tab-user.page.html",
  styleUrls: ["./tab-user.page.scss"],
})
export class TabUserPage implements OnInit, OnDestroy {
  private backButtonSub: Subscription;
  public user: User;
  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private navCtrl: NavController,
    private userData: UserData,
    private toast: ToastService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.user = await this.userData.getUser();
    if (isNullOrUndefined(this.user)) {
      await this.toast.openToast(
        "Usuario no encontrado, ingrese nuevamente",
        "danger"
      );
      this.router.navigate(["/"], { replaceUrl: true });
    } else {

    }
  }

  ngOnDestroy(): void {
    if (!isNullOrUndefined(this.backButtonSub))
      this.backButtonSub.unsubscribe();
  }

  /* ionViewDidEnter() {
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
  }

  ionViewWillLeave() {
    if (!isNullOrUndefined(this.backButtonSub))
      this.backButtonSub.unsubscribe();
  } */
}
