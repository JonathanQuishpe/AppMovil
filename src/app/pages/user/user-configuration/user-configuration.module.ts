import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserConfigurationPageRoutingModule } from './user-configuration-routing.module';

/* import { UserConfigurationPage } from './user-configuration.page'; */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserConfigurationPageRoutingModule
  ],
  declarations: [/* UserConfigurationPage */]
})
export class UserConfigurationPageModule {}
