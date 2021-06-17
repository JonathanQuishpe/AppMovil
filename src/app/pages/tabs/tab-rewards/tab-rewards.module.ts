import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabRewardsPageRoutingModule } from './tab-rewards-routing.module';

import { TabRewardsPage } from './tab-rewards.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabRewardsPageRoutingModule,
    PipesModule,
  ],
  declarations: [TabRewardsPage]
})
export class TabRewardsPageModule {}
