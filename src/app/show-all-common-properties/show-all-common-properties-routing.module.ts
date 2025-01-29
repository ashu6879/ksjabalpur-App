import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowAllCommonPropertiesPage } from './show-all-common-properties.page';

const routes: Routes = [
  {
    path: '',
    component: ShowAllCommonPropertiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowAllCommonPropertiesPageRoutingModule {}
