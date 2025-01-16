import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupVerificationPage } from './signup-verification.page';

const routes: Routes = [
  {
    path: '',
    component: SignupVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupVerificationPageRoutingModule {}
