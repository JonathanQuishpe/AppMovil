import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginSocialPageRoutingModule } from './login-social-routing.module';

import { LoginSocialPage } from './login-social.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginSocialPageRoutingModule
  ],
  declarations: [LoginSocialPage]
})
export class LoginSocialPageModule {}
