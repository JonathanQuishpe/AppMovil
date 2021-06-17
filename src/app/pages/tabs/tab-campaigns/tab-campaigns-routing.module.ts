import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabCampaignsPage } from './tab-campaigns.page';

const routes: Routes = [
  {
    path: '',
    component: TabCampaignsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabCampaignsPageRoutingModule {}
