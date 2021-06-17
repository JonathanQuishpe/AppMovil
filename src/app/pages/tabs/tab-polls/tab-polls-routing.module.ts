import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPollsPage } from './tab-polls.page';

const routes: Routes = [
  {
    path: '',
    component: TabPollsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPollsPageRoutingModule {}
