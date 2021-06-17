import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfessionalProfilePageRoutingModule } from './user-professional-profile-routing.module';

/* import { UserProfessionalProfilePage } from './user-professional-profile.page'; */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UserProfessionalProfilePageRoutingModule
  ],
  declarations: [/* UserProfessionalProfilePage */]
})
export class UserProfessionalProfilePageModule {}
