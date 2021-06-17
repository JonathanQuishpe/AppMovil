import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfessionalProfilePage } from './user-professional-profile.page';

const routes: Routes = [
  {
    path: '',
    component: UserProfessionalProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfessionalProfilePageRoutingModule {}
