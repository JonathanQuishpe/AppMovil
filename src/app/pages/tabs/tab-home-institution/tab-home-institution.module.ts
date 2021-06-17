import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabHomeInstitutionPageRoutingModule } from './tab-home-institution-routing.module';

import { TabHomeInstitutionPage } from './tab-home-institution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabHomeInstitutionPageRoutingModule
  ],
  declarations: [TabHomeInstitutionPage]
})
export class TabHomeInstitutionPageModule {}
