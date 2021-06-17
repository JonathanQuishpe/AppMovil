import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPoliticsPage } from './user-politics.page';

const routes: Routes = [
  {
    path: '',
    component: UserPoliticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPoliticsPageRoutingModule {}
