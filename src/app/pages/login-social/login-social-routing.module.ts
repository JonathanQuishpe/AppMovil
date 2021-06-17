import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginSocialPage } from './login-social.page';

const routes: Routes = [
  {
    path: '',
    component: LoginSocialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginSocialPageRoutingModule {}
