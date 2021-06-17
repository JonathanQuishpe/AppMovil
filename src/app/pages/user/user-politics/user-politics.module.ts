import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserPoliticsPageRoutingModule } from './user-politics-routing.module';

/* import { UserPoliticsPage } from './user-politics.page'; */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserPoliticsPageRoutingModule
  ],
  declarations: [/* UserPoliticsPage */]
})
export class UserPoliticsPageModule {}
