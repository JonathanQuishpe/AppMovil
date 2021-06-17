import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SummaryStatisticsPageRoutingModule } from './summary-statistics-routing.module';

import { SummaryStatisticsPage } from './summary-statistics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SummaryStatisticsPageRoutingModule
  ],
  declarations: [SummaryStatisticsPage]
})
export class SummaryStatisticsPageModule {}
