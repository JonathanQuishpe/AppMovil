import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabWalletPage } from './tab-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: TabWalletPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabWalletPageRoutingModule {}
