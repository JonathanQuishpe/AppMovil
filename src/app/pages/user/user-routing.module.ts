import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPage } from './user.page';

const routes: Routes = [
  {
    path: '',
    component: UserPage,
  },
 
  {
    path: 'informacion',
    loadChildren: () => import('../user/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'ubicacion',
    loadChildren: () => import('../user/user-location/user-location.module').then( m => m.UserLocationPageModule)
  },
  {
    path: 'empresas',
    loadChildren: () => import('./user-company/user-company.module').then( m => m.UserCompanyPageModule)
  },
  {
    path: 'user-professional-profile',
    loadChildren: () => import('./user-professional-profile/user-professional-profile.module').then( m => m.UserProfessionalProfilePageModule)
  },  {
    path: 'user-configuration',
    loadChildren: () => import('./user-configuration/user-configuration.module').then( m => m.UserConfigurationPageModule)
  },
  {
    path: 'user-politics',
    loadChildren: () => import('./user-politics/user-politics.module').then( m => m.UserPoliticsPageModule)
  }



];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
