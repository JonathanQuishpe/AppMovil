import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabPollsPageRoutingModule } from './tab-polls-routing.module';

import { TabPollsPage } from './tab-polls.page';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    FormsModule,
    IonicModule,
    TabPollsPageRoutingModule
  ],
  declarations: [TabPollsPage],
})
export class TabPollsPageModule {}
