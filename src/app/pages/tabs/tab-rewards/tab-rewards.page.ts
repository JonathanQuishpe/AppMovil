import { Component, OnInit, OnDestroy } from "@angular/core";
import { ApiService } from "../../../services/api/api.service";
import { UserData } from "../../../services/storage/user-data";
import { environment } from "../../../../environments/environment";

import { LoadingController, ModalController, NavController, Platform } from "@ionic/angular";
import { DetailRewardPage } from "../detail-reward/detail-reward.page";
import { isNullOrUndefined } from "util";
import { ToastService } from "src/app/services/toast.service";
import { Configuration } from "src/app/interfaces/poll/configuration/configuration";
import { User } from "src/app/interfaces/user/user";
import { CoreService } from "src/app/services/core.service";
import { Subscription } from "rxjs";
import { Router } from '@angular/router';
import { FilterList } from 'src/app/interfaces/filter/filterList';
import { ModalFilterPage } from '../modal-filter/modal-filter.page';
import { InstitutionCategories } from 'src/app/interfaces/institution/institutionCategories';
import { ModalOrderPage } from '../modal-order/modal-order.page';
@Component({
  selector: "app-tab-rewards",
  templateUrl: "./tab-rewards.page.html",
  styleUrls: ["./tab-rewards.page.scss"],
  providers: [UserData],
})
export class TabRewardsPage implements OnInit, OnDestroy {
  public configPolls: Configuration[];
  public configPollsTop: Configuration[];
  public configPollsBeforeFilter: Configuration[];
  public load = true;
  public pathApi = environment.API;
  public user: User;
  public darkTheme: boolean;
  public searchText: string = "";
  private backButtonSub: Subscription;
  
  public filterCategory: Array<InstitutionCategories>;
  public filterReward: Array<InstitutionCategories>;
  public filterPoll: Array<InstitutionCategories>;
  
  public filterList: FilterList[];
  public orderSelected: string;

  public today: Date;
  public todayString: string;

  constructor(
    private api: ApiService,
    private userData: UserData,
    private navCtrl: NavController,
    private modalController: ModalController,
    private toast: ToastService,
    private core: CoreService,
    private platform: Platform,
    private router: Router,
    private loadingCtrl: LoadingController,
  ) {}
  /* ****************************** NgOnInit: Cargar los métodos para que funcione esta tab-reward ****************************** */
  async ngOnInit() {
    //Check cambios
    this.listenForLoginEvents();

    this.today = new Date();
    this.todayString = this.today.toISOString().slice(0, 10);

    /* Check User*/
    this.user = await this.userData.getUser();
    if (this.user) {
      this.getConfigurationsTop();
      this.getTypeInstitutions();
      this.getTypePolls();
      this.getTypeRewards();
      this.configPolls = await this.getConfigurationsHome();
      this.configPollsBeforeFilter = this.configPolls;
      this.load = false;
    } else {
      await this.toast.openToast(
        "Usuario no encontrado, ingrese nuevamente",
        "danger"
      );
      this.router.navigate(["/"], { replaceUrl: true });
    }
  }

  ngOnDestroy(): void {
  }

  /* ****************************** Data a refrescar ****************************** */
  async doRefresh(event) {
    try {
      this.configPolls = await this.getConfigurationsHome();
      event.target.complete();
    } catch (error) {
      event.target.complete();
      await this.toast.openToast("Error en el servidor", "danger");
    }
  }
  /* ****************************** Métodos que consumen api's ****************************** */
  async getConfigurationsHome(): Promise<any> {
    let configuration = null;
    const token = await this.userData.getToken();
    configuration = await this.api
      .getAll("configurations/home?wallets.email=" + this.user.email, token)
      .toPromise()
      .catch(async (error) => {
        let errorMessage = this.core.errorMessages(error);
        await this.toast.openToast(errorMessage, "danger");
      });
    //Cargando rewards en el configPoll
    if (configuration) {
      configuration.map((item) => {
        this.api.getAll("rewards/" + item.reward.id, token).subscribe(
          async (resp) => {
            item.reward = resp;
            item.favorite = false;

            let favoriteConfigPoll: Configuration[] = [];
            favoriteConfigPoll = await this.userData.getFavoriteConfigurationReward();
            if (favoriteConfigPoll) {
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

  async getConfigurationsTop() {
    let configuration = null;
    const token = await this.userData.getToken();
    configuration = await this.api
      .getAll("configurations/top?wallets.email=" + this.user.email, token)
      .toPromise()
      .catch(async (error) => {
        /* let errorMessage = this.core.errorMessages(error);
        await this.toast.openToast(errorMessage, "danger"); */
      });

    if (configuration) {
      configuration.map((item) => {
        this.api.getAll("rewards/" + item.reward.id, token).subscribe(
          async (resp) => {
            item.reward = resp;
            item.favorite = false;

            let favoriteConfigPoll: Configuration[] = [];
            favoriteConfigPoll = await this.userData.getFavoriteConfigurationPoll();
            if (favoriteConfigPoll) {
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
    this.configPollsTop = configuration;
  }

  async getTypeInstitutions() {
    const token = await this.userData.getToken();
    this.api.getAll("type-institutions", token).subscribe(
      (res) => {
        const filterCategory = res;
        if (filterCategory)
          this.filterCategory = filterCategory;
      },
      async (error) => {
        console.log(error);
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
    window.addEventListener("charge:configuration", async () => {
      this.configPolls = await this.getConfigurationsHome();
    });
  }

  

  /* ****************************** Capturar el boton de Back (Android) ****************************** */
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
        this.navCtrl.navigateForward(
            
            this.user.role.name === "Establecimiento"
              ? "tabs/home-establecimiento"
              : "tabs/home"
          );
      });
    }
  }

  ionViewWillLeave() {
    if (!isNullOrUndefined(this.backButtonSub))
      this.backButtonSub.unsubscribe();
  } */

  /* ****************************** Métodos varios ****************************** */
  async showDetails(index) {
    let concatConfigPollTop;
    if(this.configPollsTop){
      concatConfigPollTop = this.configPollsTop;
      concatConfigPollTop.unshift(this.configPolls[index]);
    }
    let modal = await this.modalController.create({
      component: DetailRewardPage,
      cssClass: "my-custom-modal-css",
      componentProps: {
        originPage: "tab-polls",
        poolSelected: 0,
        configPolls: concatConfigPollTop,
      },
    });
     modal.onDidDismiss().then((dataReturned) => {
      if (concatConfigPollTop){
        if (concatConfigPollTop.length > 0) {
          concatConfigPollTop.splice(0,1);
        }
      }
    });
    return await modal.present();
  }

  async showFilter() {
    if(!this.filterList){
      this.filterList = [
        { name: "Categoría", open: false, types: this.filterCategory },
        { name: "Tipo de recompensa", open: false, types: this.filterReward },
        { name: "Tipo de formulario", open: false, types: this.filterPoll },
      ];
    }

    let modal = await this.modalController.create({
      component: ModalFilterPage,
      cssClass: "my-custom-modal",
      componentProps: {
        originPage: "recompensas",
        filterList: this.filterList,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      try {
        this.filterList = dataReturned.data.filterList;
        this.filterConfigurationPoll();
      } catch (error) {}
    });

    return await modal.present();
  }

  async showOrder() {
    if(!this.orderSelected) this.orderSelected =  null;

    let modal = await this.modalController.create({
      component: ModalOrderPage,
      cssClass: "my-custom-modal",
      componentProps: {
        originPage: "recompensas",
        orderValue: this.orderSelected,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      try {
        this.orderSelected = dataReturned.data.orderValue;
        this.orderConfigurationPoll();
      } catch (error) {}
    });

    return await modal.present();
  }

  async filterConfigurationPoll() {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    this.configPolls = this.configPollsBeforeFilter;  
    let categoriesChecked = [];
    let configFiltered = [];
    
    if(this.filterList[0].types){
      for await (const filter of this.filterList) {
        categoriesChecked = filter.types.filter((type)=> type.isChecked == true);
        
        if(categoriesChecked.length > 0){
          if(filter.name == "Categoría"){
            for await (const checked of categoriesChecked) {          
              const filterInstitution = this.configPolls.filter((element) => element.institution.type_institution == checked.name);
              if(configFiltered.length != 0){             
                configFiltered = configFiltered.concat(filterInstitution);
              }else{
                configFiltered = filterInstitution;
              }
            }
          }
          if(filter.name == "Tipo de recompensa"){
            if(configFiltered.length != 0 ){
              let configAux=[];
              for await (const checked of categoriesChecked) {          
                const filterReward = configFiltered.filter((element) => element.reward.type_reward.name == checked.name);
                if(configAux.length != 0){             
                  configAux = configAux.concat(filterReward);
                }else{
                  configAux = filterReward;
                }
              }
              configFiltered = configAux;
            }else{
              for await (const checked of categoriesChecked) {          
                const filterReward = this.configPolls.filter((element) => element.reward.type_reward.name == checked.name);
                if(configFiltered.length != 0){             
                  configFiltered = configFiltered.concat(filterReward);
                }else{
                  configFiltered = filterReward;
                }
              }
            }
          }
          if(filter.name == "Tipo de formulario"){
            if(configFiltered.length != 0 ){
              let configAux=[];
              for await (const checked of categoriesChecked) {          
                const filterPoll = configFiltered.filter((element) => element.poll.type_poll == checked.name);
                if(configAux.length != 0){             
                  configAux = configAux.concat(filterPoll);
                }else{
                  configAux = filterPoll;
                }
              }
              configFiltered = configAux;
            }else{
              for await (const checked of categoriesChecked) {          
                const filterPoll = this.configPolls.filter((element) => element.poll.type_poll == checked.name);
                if(configFiltered.length != 0){             
                  configFiltered = configFiltered.concat(filterPoll);
                }else{
                  configFiltered = filterPoll;
                }
              }
            }
          }
          this.configPolls = configFiltered;        
        }
      }
    }
    
    loading.dismiss(); 
  }

  async orderConfigurationPoll() {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    if(this.orderSelected){
      let orderConfigPoll = this.configPolls.sort((a, b)=>{
        if(this.orderSelected == "Tipo de encuesta"){
          if (a.poll.type_poll > b.poll.type_poll) {
            return 1;
          }
          if (a.poll.type_poll < b.poll.type_poll) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }

        if(this.orderSelected == "Encuesta"){
          if (a.poll.name > b.poll.name) {
            return 1;
          }
          if (a.poll.name < b.poll.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }

        if(this.orderSelected == "Recompensa"){
          if (a.reward.name > b.reward.name) {
            return 1;
          }
          if (a.reward.name < b.reward.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }
      });
      this.configPolls = orderConfigPoll;
    }
    loading.dismiss();
    

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

  async addRemoveFavorite(index) {
    try {
      this.configPolls[index].favorite = !this.configPolls[index].favorite;
      let favoriteConfigPoll: Configuration[] = [];

      favoriteConfigPoll = await this.userData.getFavoriteConfigurationReward();
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
      await this.userData.setFavoriteConfigurationReward(favoriteConfigPoll);
      window.dispatchEvent(new CustomEvent("charge:favorites"));
    } catch (error) {
      console.log(error);
    }
  }

  onSearchChangePoll(event) {
    const text = event.target.value;
    this.searchText = text;
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
