import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SummaryStatisticsPage } from './summary-statistics.page';

const routes: Routes = [
  {
    path: '',
    component: SummaryStatisticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SummaryStatisticsPageRoutingModule {}
