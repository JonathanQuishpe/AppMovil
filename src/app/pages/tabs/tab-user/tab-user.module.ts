import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TabUserPageRoutingModule } from "./tab-user-routing.module";

import { TabUserPage } from "./tab-user.page";

import { UserPage } from "../../user/user.page";
import { UserCompanyPage } from "../../user/user-company/user-company.page";
import { UserLocationPage } from "../../user/user-location/user-location.page";
import { UserProfessionalProfilePage } from "../../user/user-professional-profile/user-professional-profile.page";
import { UserProfilePage } from "../../user/user-profile/user-profile.page";
import { UserConfigurationPage } from "../../user/user-configuration/user-configuration.page";
import { UserPoliticsPage } from "../../user/user-politics/user-politics.page";

import { UserPageRoutingModule } from "../../user/user-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TabUserPageRoutingModule,
    UserPageRoutingModule,
  ],
  declarations: [
    TabUserPage,
    UserPage,
    UserCompanyPage,
    UserLocationPage,
    UserProfessionalProfilePage,
    UserProfilePage,
    UserConfigurationPage,
    UserPoliticsPage,
  ],
})
export class TabUserPageModule {}
