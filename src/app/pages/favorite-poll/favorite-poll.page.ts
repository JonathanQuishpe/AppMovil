import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { UserData } from "../../services/storage/user-data";
import { environment } from "../../../environments/environment";
import {
  ModalController,
  NavController,
  ActionSheetController,
  AlertController,
} from "@ionic/angular";
import { DetailRewardPage } from "../tabs/detail-reward/detail-reward.page";
import { isUndefined, isNullOrUndefined } from "util";
import { Configuration } from "src/app/interfaces/poll/configuration/configuration";
import { CoreService } from "src/app/services/core.service";
import { PollAnswered } from "src/app/interfaces/poll/pollAnswered";

@Component({
  selector: "app-favorite-poll",
  templateUrl: "./favorite-poll.page.html",
  styleUrls: ["./favorite-poll.page.scss"],
})
export class FavoritePollPage implements OnInit {
  public favoriteConfigPoll: Configuration[];
  public favoriteConfigReward: Configuration[];
  public polls: Array<any>;
  public load = true;
  public pathApi = environment.API;
  public panelDetail: string;
  public darkTheme: boolean;
  public pollSaved: PollAnswered;

  constructor(
    private api: ApiService,
    private userData: UserData,
    private modalController: ModalController,
    private core: CoreService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  async ngOnInit() {
    //Check cambios
    this.listenForLoginEvents();

    /* Check User*/
    this.getFavorites();
    this.panelDetail = "poll";
  }

  /* ionViewDidEnter() {
    console.log("entro favorite");
    
    if (this.platform.is("android")) {
      this.backButtonSub = this.platform.backButton.subscribe(async () => {
        const modal = await this.modalController.getTop();
        if (modal) modal.dismiss();
        else this.navCtrl.navigateForward("/tabs/home");
      });
    }
    
  }

  ionViewWillLeave() {
    console.log("no entro favorite");
    
    if (!isNullOrUndefined(this.backButtonSub))
      this.backButtonSub.unsubscribe();
  } */

  async getFavorites() {

    this.favoriteConfigPoll = await this.userData.getFavoriteConfigurationPoll();
    this.favoriteConfigReward = await this.userData.getFavoriteConfigurationReward();
  }

  listenForLoginEvents() {
    window.addEventListener("charge:favorites", async () => {
      this.getFavorites();
    });
  }

  async showDetails(index) {
    const modal = await this.modalController.create({
      component: DetailRewardPage,
      cssClass: "my-custom-class",
      componentProps: {
        poolSelected: index,
        originPage: "/favoritos",
        configPolls:
          this.panelDetail == "poll"
            ? this.favoriteConfigPoll
            : this.favoriteConfigReward, //this.polls,
      },
    });
    return await modal.present();
  }

  chargePanel(event: any) {
    this.panelDetail = event.detail.value;
  }

  onErrorImg(img) {
    try {
      if (img.url) {
        return img.url;
      } else {
        return this.panelDetail == "poll"
          ? "../../../assets/img/temp_empresa.png"
          : "../../../assets/img/temp_promo.jpg";
      }
    } catch (error) {
      return this.panelDetail == "poll"
        ? "../../../assets/img/temp_empresa.png"
        : "../../../assets/img/temp_promo.jpg";
    }
  }

  checkFavorites(favorites) {
    try {
      if (favorites.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async cleanFavorites(){
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: "Favoritos",
      message: "¿Realmente desea eliminar sus favoritos?",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            
          },
        },
        {
          text: "Sí",
          handler: () => {
            //this.userData.removeAllFavorites();
            this.getFavorites();
          },
        },
      ],
    });
    await alert.present();
  }

  continueConfigPoll(index: number, isFavoritePoll: boolean) {
    let configId = isFavoritePoll
      ? this.favoriteConfigPoll[index].config.id
      : this.favoriteConfigReward[index].config.id;

    this.userData.getQuestions().then(async (val) => {
      this.pollSaved = val;
      if (!isNullOrUndefined(this.pollSaved)) {
        if (configId != this.pollSaved.configId) {
          const actionSheet = await this.actionSheetController.create({
            header: "Tienes una encuesta en progreso",
            cssClass: "my-custom-class",
            buttons: [
              {
                text: "Continuar con la anterior",
                icon: "refresh",
                handler: () => {
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
                  this.navCtrl.navigateForward(`encuesta/${configId}`);
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
          this.navCtrl.navigateForward(`encuesta/${configId}`);
        }
      } else {
        this.navCtrl.navigateForward(`encuesta/${configId}`);
      }
    });
  }
}
