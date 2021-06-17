import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TabsPageRoutingModule } from "./tabs-routing.module";

import { TabsPage } from "./tabs.page";
import { DetailRewardPage } from "./detail-reward/detail-reward.page";
import { ModalFilterPage } from "./modal-filter/modal-filter.page";
import { ModalOrderPage } from "./modal-order/modal-order.page";

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, TabsPageRoutingModule],
  declarations: [TabsPage, DetailRewardPage, ModalFilterPage, ModalOrderPage],
})
export class TabsPageModule {}
