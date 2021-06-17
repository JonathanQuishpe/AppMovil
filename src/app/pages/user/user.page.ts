import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavController, LoadingController } from "@ionic/angular";
import { CoreService } from "./../../services/core.service";
import { UserData } from "../../services/storage/user-data";
import { Router, ActivatedRoute } from "@angular/router";
import { StringDecoder } from "string_decoder";
import { isUndefined, isNumber, isNullOrUndefined, isString } from "util";
import { ToastService } from "src/app/services/toast.service";
import { User } from 'src/app/interfaces/user/user';
@Component({
  selector: "app-user",
  templateUrl: "./user.page.html",
  styleUrls: ["./user.page.scss"],
  providers: [CoreService, UserData],
})
export class UserPage implements OnInit, OnDestroy {
  public random: string;
  public user: User;
  public userList;

  constructor(
    private core: CoreService,
    private userData: UserData,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    this.user = await this.userData.getUser();
    /* Check User*/
    if (!isNullOrUndefined(this.user)) {
      this.userList = this.core.handlerMenuUser(this.user.role.name);
      this.reviewImg();
    } else {
      await this.toast.openToast(
        "Usuario no encontrado, ingrese nuevamente",
        "danger"
      );
      this.navCtrl.navigateForward("/");
    }
  }

  ngOnDestroy(){
    console.log("salio de user");
    
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

  logout() {
    this.userData.logout().then(() => {
      return this.navCtrl.navigateRoot("/");
    });
  }
}
