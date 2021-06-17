import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserCompanyPageRoutingModule } from './user-company-routing.module';

/* import { UserCompanyPage } from './user-company.page';
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserCompanyPageRoutingModule
  ],
  declarations: [/* UserCompanyPage */]
})
export class UserCompanyPageModule {}
