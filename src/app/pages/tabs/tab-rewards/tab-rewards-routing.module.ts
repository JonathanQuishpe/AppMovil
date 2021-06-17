import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabRewardsPage } from './tab-rewards.page';

const routes: Routes = [
  {
    path: '',
    component: TabRewardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabRewardsPageRoutingModule {}
