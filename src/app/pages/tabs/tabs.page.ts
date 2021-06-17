import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/services/storage/user-data';
import { User } from 'src/app/interfaces/user/user';
import { Tab } from 'src/app/interfaces/tab/tab';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ModalFilterPage } from './modal-filter/modal-filter.page';
import { FilterList } from 'src/app/interfaces/filter/filterList';
import { InstitutionCategories } from 'src/app/interfaces/institution/institutionCategories';
import { isNullOrUndefined } from 'util';
import { ApiService } from 'src/app/services/api/api.service';
import { Router } from '@angular/router';
import { ModalOrderPage } from './modal-order/modal-order.page';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  providers: [UserData]
})
export class TabsPage implements OnInit{

  public user: User;
  public tabs: Array<Tab>;
  public widthWindows: number;

  public filterCategory: Array<InstitutionCategories>;
  public filterReward: Array<InstitutionCategories>;
  public filterPoll: Array<InstitutionCategories>;

  public filterList: FilterList[];

  public orderSelected: string;

  public searchText: string;

  

  constructor(
    private userData: UserData,
    public platform: Platform,
    private modalController: ModalController,
    private api: ApiService,
    private navCtrl: NavController,
    private router: Router,
    
  ) {}

   async ngOnInit(){
    this.user = await this.userData.getUser();    
    this.createTabs();
    this.validPlatform();
    this.getTypesCtegories();
    
  }

  async createTabs(){
    switch (this.user.role.name) {
      case 'User':
      case 'Supervisor':
        this.tabs = [
          {
            tab: 'home',
            icon: 'home',
            label: 'Home'
          }, {
            tab: 'encuestas',
            icon: 'document',
            label: 'Encuestas'
          }, {
            tab: 'recompensas',
            icon: 'gift',
            label: 'Recompensas'
          }, {
            tab: 'billetera',
            icon: 'wallet',
            label: 'Billetera'
          }, {
            tab: 'perfil',
            icon: 'person-circle',
            label: 'Perfil'
          }
        ];
        break;
      case 'Establecimiento':
        this.tabs = [
          {
            tab: 'home-establecimiento',
            icon: 'home',
            label: 'Home'
          }/* , {
            tab: 'encuestas',
            icon: 'document',
            label: 'Encuestas'
          } */, {
            tab: 'campanas',
            icon: 'documents',
            label: 'Campañas'
          }, {
            tab: 'perfil',
            icon: 'person-circle',
            label: 'Perfil'
          }
        ];
        break;
    }
    
  }

  getTypesCtegories(){
    if(this.user.role.name != "Establecimiento"){
      this.getTypeInstitutions();
      this.getTypePolls();
      this.getTypeRewards();
    }
  }

  validPlatform(){
    this.widthWindows = this.platform.width();
    this.platform.resize.subscribe(async () => {
      this.widthWindows = this.platform.width();
    });
  }

/*   ionTabsDidChange($event) {
    console.log('[TabsPage] ionTabsDidChange, $event: ', $event);
  } */

  async showFilter() {
    this.filterList = await this.userData.getFilters();
   
    
    if(!this.filterList){
      this.userData.setFilters(null);
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
        originPage: "tabs",
        filterList: this.filterList,
      },
    });

    modal.onDidDismiss().then(async (dataReturned) => {
      try {
        this.filterList = dataReturned.data.filterList;
        await this.userData.setFilters(this.filterList);
        if(this.router.url == '/tabs/encuestas'){
          window.dispatchEvent(new CustomEvent("charge:filter"));
        }else{
          this.router.navigate(['tabs/encuestas']);
        }
      } catch (error) {}
    });

    return await modal.present();
  }

  async showOrder() {
    this.orderSelected = await this.userData.getOrders();
    
    if (!this.orderSelected){
      //this.userData.setOrders(null);
      this.orderSelected = null;
    }

    let modal = await this.modalController.create({
      component: ModalOrderPage,
      cssClass: "my-custom-modal",
      componentProps: {
        originPage: "tabs",
        orderValue: this.orderSelected,
      },
    });

    modal.onDidDismiss().then(async (dataReturned) => {
      try {
        this.orderSelected = dataReturned.data.orderValue;
        await this.userData.setOrders(this.orderSelected);
        if(this.router.url == '/tabs/encuestas'){
          window.dispatchEvent(new CustomEvent("charge:order"));
        }else{
          this.router.navigate(['tabs/encuestas']);
        }
      } catch (error) {}
    });

    return await modal.present();
  }

  async onSearchChangePoll(event) {
    const text = event.target.value;
    await this.userData.setSearch(text);
    if(this.router.url == '/tabs/encuestas'){
      window.dispatchEvent(new CustomEvent("charge:search"));
    }else{
      this.router.navigate(['tabs/encuestas']);
    }
  }

  

  async getTypeInstitutions() {
    const token = await this.userData.getToken();
    this.api.getAll("type-institutions", token).subscribe(
      (res) => {
        const filterCategory = res;
        if (filterCategory){
          this.filterCategory = filterCategory;
        }
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
        if (filterPoll) this.filterReward = filterPoll;
      },
      async (error) => {
        console.log(error);
      }
    );
  }
}
