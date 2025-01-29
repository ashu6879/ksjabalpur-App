import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowAllBuildersPage } from './show-all-builders.page';

const routes: Routes = [
  {
    path: '',
    component: ShowAllBuildersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowAllBuildersPageRoutingModule {}
