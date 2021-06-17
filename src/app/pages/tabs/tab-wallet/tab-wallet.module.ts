import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabWalletPageRoutingModule } from './tab-wallet-routing.module';

import { TabWalletPage } from './tab-wallet.page';
import { FavoritePollPage } from '../../favorite-poll/favorite-poll.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabWalletPageRoutingModule
  ],
  declarations: [TabWalletPage, FavoritePollPage]
})
export class TabWalletPageModule {}
