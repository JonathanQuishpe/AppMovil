import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoritePollPageRoutingModule } from './favorite-poll-routing.module';

//import { FavoritePollPage } from './favorite-poll.page';
//import { DetailRewardPage } from "../tabs/detail-reward/detail-reward.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritePollPageRoutingModule
  ],
  declarations: [/* FavoritePollPage */]
})
export class FavoritePollPageModule {}
