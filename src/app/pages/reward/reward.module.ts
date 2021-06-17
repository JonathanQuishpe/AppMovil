import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RewardPageRoutingModule } from './reward-routing.module';

import { RewardPage } from './reward.page';
import { NgxQRCodeModule } from "ngx-qrcode2";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxQRCodeModule,
    IonicModule,
    RewardPageRoutingModule
  ],
  declarations: [RewardPage]
})
export class RewardPageModule {}
