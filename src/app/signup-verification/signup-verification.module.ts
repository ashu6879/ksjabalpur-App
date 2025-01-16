import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupVerificationPageRoutingModule } from './signup-verification-routing.module';

import { SignupVerificationPage } from './signup-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupVerificationPageRoutingModule
  ],
  declarations: [SignupVerificationPage]
})
export class SignupVerificationPageModule {}
