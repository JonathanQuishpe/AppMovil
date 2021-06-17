import { Component, OnInit, SimpleChanges, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import {
  MenuController,
  Platform,
  NavController,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { CoreService } from "./services/core.service";
import { UserData } from "./services/storage/user-data";
import { isUndefined, isNumber, isNullOrUndefined, isNull } from "util";
import { PollAnswered } from "./interfaces/poll/pollAnswered";
import { User } from "./interfaces/user/user";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  providers: [UserData, CoreService],
})
export class AppComponent implements OnInit {
  public random: string;
  public user: User;
  public appPages = [];
  public selectedIndex: number = 0;
  public progressPoll: number = 0;
  public pollSaved: PollAnswered;
  public isRemainder = 0;
  public showSlides: string;

  constructor(
    private menu: MenuController,
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userData: UserData,
    private core: CoreService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private modalController: ModalController
  ) {
    this.checkLoginStatus();
    this.listenForLoginEvents();
    this.initializeApp();
  }

  async initializeApp() {
    /* this.showSlides = await this.userData.getShowSlides();
    this.user = await this.userData.getUser(); */
    this.platform.ready().then(async () => {

      /* if(!isNullOrUndefined(this.showSlides)){
        if(this.showSlides == "visto"){
          if (!isNullOrUndefined(this.user)) {
            this.navCtrl.navigateRoot(
              this.user.role.name === "Establecimiento"
                ? "tabs/home-establecimiento"
                : "tabs/home"
            );
          }else{
            this.navCtrl.navigateRoot("/");
          }
        }else{
          this.navCtrl.navigateRoot("bienvenida");
        }
      }else{
        this.navCtrl.navigateRoot("bienvenida");
      } */
      
      //this.statusBar.styleDefault();
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      //this.setAndroidBackButtonBehavior();
    });
  }

  /* setAndroidBackButtonBehavior() {
    console.log(window.location.pathname);

    if (this.platform.is("android")) {
      this.platform.backButton.subscribe(async () => {
        const modal = await this.modalController.getTop();

        if (window.location.pathname == "/tabs/home") {
          if (modal) modal.dismiss();
          else navigator["app"].exitApp();
        }

        if (window.location.pathname == "/tabs/home")
          navigator["app"].exitApp();
        if (window.location.pathname == "/home/encuestas")
          this.navCtrl.navigateBack("/tabs/home");
        if (window.location.pathname == "/home/recompensas")
          this.navCtrl.navigateBack("/tabs/home");
        if (window.location.pathname == "/home/billetera")
          this.navCtrl.navigateBack("/tabs/home");
        if (window.location.pathname == "/home/perfil")
          this.navCtrl.navigateBack("/tabs/home");
      });
    }
  } */

  ngOnInit() {
    this.checkTheme();
  }

  checkTheme() {
    let isDarkThemeSystem = window.matchMedia("(prefers-color-scheme: dark)")
      .matches;
    document.body.classList.toggle("dark", isDarkThemeSystem);
    this.userData.setTheme(isDarkThemeSystem ? "dark" : "light");
  }

  async home() {
    //this.random = await this.core.avatarProfile();
    let path = window.location.pathname;
    path = path.indexOf("home") > 0 ? "/home" : path;
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.url.toLowerCase() === path.toLowerCase()
      );
    }
  }

  async checkLoginStatus() {
    return this.userData.isLoggedIn().then((loggedIn) => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  async updateLoggedInStatus(loggedIn: boolean) {
    //setTimeout(() => {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    /*  if (loggedIn) {
      this.userData.getUser().then((user) => {
        this.user.username = user.username;
        this.user.email = user.email;
        this.reviewImg();
        //this.menu.enable(loggedIn);
        loading.dismiss();
        const rol = user.role.id;
        if (rol === 1) {
        } else if (rol === 3) {
        }
      });
      this.home();
    } else {
      loading.dismiss();
    } */
    loading.dismiss();
    // }, 800);
  }

  listenForLoginEvents() {
    window.addEventListener("user:login", () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener("user:signup", () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener("user:logout", () => {
      this.updateLoggedInStatus(false);
    });
    window.addEventListener("img:change", () => {
      this.reviewImg();
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.navCtrl.navigateRoot("");
    });
  }

  continuePoll() {
    return `encuesta/${this.pollSaved.configId}`;
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
    this.core.avatarProfile().then((resp) => {
      this.random = resp;
    });
  }
}
