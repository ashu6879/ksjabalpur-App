import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllBuildersPageRoutingModule } from './all-builders-routing.module';

import { AllBuildersPage } from './all-builders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllBuildersPageRoutingModule
  ],
  declarations: [AllBuildersPage]
})
export class AllBuildersPageModule {}
