import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommercialPropertiesPage } from './commercial-properties.page';

const routes: Routes = [
  {
    path: '',
    component: CommercialPropertiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercialPropertiesPageRoutingModule {}
