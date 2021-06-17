import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabHomeInstitutionPage } from './tab-home-institution.page';

const routes: Routes = [
  {
    path: '',
    component: TabHomeInstitutionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabHomeInstitutionPageRoutingModule {}
