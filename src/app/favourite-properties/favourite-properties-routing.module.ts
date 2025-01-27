import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavouritePropertiesPage } from './favourite-properties.page';

const routes: Routes = [
  {
    path: '',
    component: FavouritePropertiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouritePropertiesPageRoutingModule {}
