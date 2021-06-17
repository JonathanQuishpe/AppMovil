import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartSlidePage } from './start-slide.page';

const routes: Routes = [
  {
    path: '',
    component: StartSlidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartSlidePageRoutingModule {}
