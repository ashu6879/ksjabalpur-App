import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonPropertyPagePage } from './common-property-page.page';

const routes: Routes = [
  {
    path: '',
    component: CommonPropertyPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonPropertyPagePageRoutingModule {}
