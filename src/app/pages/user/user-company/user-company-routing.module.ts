import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserCompanyPage } from './user-company.page';

const routes: Routes = [
  {
    path: '',
    component: UserCompanyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserCompanyPageRoutingModule {}
