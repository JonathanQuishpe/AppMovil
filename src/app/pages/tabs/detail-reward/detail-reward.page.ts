import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { ModalController, NavController, Platform } from "@ionic/angular";
import { ApiService } from "src/app/services/api/api.service";
import { UserData } from "src/app/services/storage/user-data";
import { isNullOrUndefined } from "util";
import { PollAnswered } from "src/app/interfaces/poll/pollAnswered";
import { AlertController } from "@ionic/angular";
import { ActionSheetController } from "@ionic/angular";
import { Configuration } from "src/app/interfaces/poll/configuration/configuration";

@Component({
  selector: "app-detail-reward",
  templateUrl: "./detail-reward.page.html",
  styleUrls: ["./detail-reward.page.scss"],
  providers: [UserData],
})
export class DetailRewardPage implements OnInit, OnDestroy {
  @Input() poolSelected: number;
  @Input() configPolls: Configuration[];
  @Input() originPage: string;

  public pollSaved: PollAnswered;
  public pathApi = environment.API;
  public slideOpts: any;
  public showSlide: boolean;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private userData: UserData,
    private modalController: ModalController,
    private navCtrl: NavController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private platform: Platform,
  ) {
    /* Por alguna extraña razón las options del slide no se activan al lanzar el modal a partir de la segunda vez
    Por esta razón se añade esta variable boolean que permite en un período de tiempo ínfimo de espera rebuildear la view */
    setTimeout(() => {
      this.slideOpts = {
        initialSlide: this.poolSelected,
        speed: 400,
      };
      this.showSlide = true;
    }, 1);
  }
  ngOnDestroy(): void {
    /* this.userData.getFavoritesPoll().then(async (val) => {
      const favoritePoll = val;
      if (favoritePoll != null && !isUndefined(favoritePoll)) {
        favoritePoll[this.poolSelected].isFavorite == this.isFavorite;
      }
    }); */
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }

  showPoll(index) {
    this.userData.getQuestions().then(async (val) => {
      this.pollSaved = val;
      if (!isNullOrUndefined(this.pollSaved)) {
        if (
          this.configPolls[this.poolSelected].config.id !=
          this.pollSaved.configId
        ) {
          const actionSheet = await this.actionSheetController.create({
            header: "Tienes una encuesta en progreso",
            cssClass: "my-custom-class",
            buttons: [
              {
                text: "Continuar con la anterior",
                icon: "refresh",
                handler: () => {
                  this.dismiss();
                  this.navCtrl.navigateForward(
                    `encuesta/${this.pollSaved.configId}`
                  );
                },
              },
              {
                text: "Iniciar nueva encuesta",
                icon: "document-text",
                handler: () => {
                  this.userData.setQuestions(null);
                  this.dismiss();
                  console.log(this.configPolls);

                  this.navCtrl.navigateForward(
                    `encuesta/${this.configPolls[index].config.id}`
                  );
                },
              },
              {
                text: "Cancel",
                icon: "close",
                role: "cancel",
                handler: () => {
                  console.log("Cancel clicked");
                },
              },
            ],
          });
          await actionSheet.present();
        } else {
          this.dismiss();
          this.navCtrl.navigateForward(
            `encuesta/${this.configPolls[index].config.id}`
          );
        }
      } else {
        this.dismiss();
        this.navCtrl.navigateForward(
          `encuesta/${this.configPolls[index].config.id}`
        );
      }
    });
  }

  async addRemoveFavorite(index) {
    try {
      this.configPolls[index].favorite = !this.configPolls[index].favorite;
      let favoriteConfigPoll: Configuration[] = [];
      if (this.originPage === "tab-rewards")
        favoriteConfigPoll = await this.userData.getFavoriteConfigurationReward();
      if (this.originPage === "tab-polls" || this.originPage === "tab-home")
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

      if (this.originPage === "tab-rewards")
        await this.userData.setFavoriteConfigurationReward(favoriteConfigPoll);
      if (this.originPage === "tab-polls")
        await this.userData.setFavoriteConfigurationPoll(favoriteConfigPoll);
        
      window.dispatchEvent(new CustomEvent("charge:favorites"));
    } catch (error) {
      console.log(error);
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
