import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserData } from 'src/app/services/storage/user-data';

@Component({
  selector: 'app-modal-order',
  templateUrl: './modal-order.page.html',
  styleUrls: ['./modal-order.page.scss'],
})
export class ModalOrderPage implements OnInit {
  public show: boolean;
  @Input() originPage: string;
  @Input() orderValue: string;
  public orderListName: Array<any>
  public itemList: any;

  constructor(
    private modalController: ModalController,
    private userData: UserData,
  ) {
    setTimeout(() => {
      this.orderListName = ["Tipo de encuesta", "Encuesta", "Recompensa" ];
    }, 20);
    
   }

  ngOnInit() {
  }

  dismiss() {
        
    this.modalController.dismiss({
      dismissed: true,
      orderValue: this.orderValue,
    });
    window.dispatchEvent(new CustomEvent("order:modal"));
  }

  clean(){
    this.orderValue = null;
    this.userData.setOrders(null);
  }

}
