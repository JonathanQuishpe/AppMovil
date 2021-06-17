import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoritePollPage } from './favorite-poll.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritePollPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritePollPageRoutingModule {}
