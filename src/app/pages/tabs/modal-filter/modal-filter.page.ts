import { Component, OnInit, Input } from "@angular/core";
import { ApiService } from "src/app/services/api/api.service";
import { UserData } from "src/app/services/storage/user-data";
import { CoreService } from "src/app/services/core.service";
import {
  NavController,
  ModalController,
  Platform,
  AlertController,
} from "@ionic/angular";
import { ToastService } from "src/app/services/toast.service";
import { Router } from "@angular/router";
import { InstitutionCategories } from "src/app/interfaces/institution/institutionCategories";
import { FilterList } from "src/app/interfaces/filter/filterList";

@Component({
  selector: "app-modal-filter",
  templateUrl: "./modal-filter.page.html",
  styleUrls: ["./modal-filter.page.scss"],
})
export class ModalFilterPage implements OnInit {
  /*  @Input() filterInstitution: Array<any>; */
  @Input() originPage: string;
  @Input() filterList: FilterList[];
  public automaticClose = true;
  public show: boolean;

  constructor(
    private api: ApiService,
    private userData: UserData,
    private core: CoreService,
    private navCtrl: NavController,
    private modalController: ModalController,
    private toast: ToastService,
    private platform: Platform,
    private router: Router,
    private alertController: AlertController
  ) {
    setTimeout(() => {
      this.show = true;
    }, 20);
  }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
      filterList: this.filterList,
    });
    /*     if(this.originPage == "tabs"){
      this.navCtrl.navigateForward("tabs/encuestas");
    } */
  }

  toggleSection(index) {
    this.filterList[index].open = !this.filterList[index].open;

    if (this.automaticClose && this.filterList[index].open) {
      this.filterList
        .filter((item, itemIndex) => itemIndex != index)
        .map((item) => (item.open = false));
    }
  }

  async clean() {
    for await (const filter of this.filterList) {
      filter.types.map((types) => {
        if (types.isChecked) {
          types.isChecked = false;
        }
        return types;
      });
    }
    this.userData.setFilters(null);
  }

  /* async cleanFilter() {

    let hasChecked = false;
    for await (const filter of this.filterList) {
      let filterAreChecked = filter.types.some((type) => {
        type.isChecked === true;
      });
      if (filterAreChecked) {
        hasChecked = true;
      }
    }

    if (hasChecked) {
      const alert = await this.alertController.create({
        // cssClass: 'my-custom-class',
        header: "Filtros",
        message: "¿Realmente desea limpiar todos los filtros marcados?",
        buttons: [
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {
              //console.log("Confirm Cancel: blah");
            },
          },
          {
            text: "Sí",
            handler: async () => {
              for await (const filter of this.filterList) {
                filter.types
                  .filter((type) => {
                    type.isChecked === true;
                  })
                  .map((type, index) => {
                    type.isChecked = false;
                  });
              }
            },
          },
        ],
      });

      await alert.present();
    }
  } */

  goToTab() {
    this.dismiss();
  }
}
