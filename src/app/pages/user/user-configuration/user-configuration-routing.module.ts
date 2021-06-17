import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserConfigurationPage } from './user-configuration.page';

const routes: Routes = [
  {
    path: '',
    component: UserConfigurationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserConfigurationPageRoutingModule {}
