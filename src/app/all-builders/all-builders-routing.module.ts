import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllBuildersPage } from './all-builders.page';

const routes: Routes = [
  {
    path: '',
    component: AllBuildersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllBuildersPageRoutingModule {}
