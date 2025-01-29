import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowAllBuildersPageRoutingModule } from './show-all-builders-routing.module';

import { ShowAllBuildersPage } from './show-all-builders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowAllBuildersPageRoutingModule
  ],
  declarations: [ShowAllBuildersPage]
})
export class ShowAllBuildersPageModule {}
