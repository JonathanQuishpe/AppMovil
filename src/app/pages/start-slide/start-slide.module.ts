import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartSlidePageRoutingModule } from './start-slide-routing.module';

import { StartSlidePage } from './start-slide.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartSlidePageRoutingModule
  ],
  declarations: [StartSlidePage]
})
export class StartSlidePageModule {}
