import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowAllCommonPropertiesPageRoutingModule } from './show-all-common-properties-routing.module';

import { ShowAllCommonPropertiesPage } from './show-all-common-properties.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowAllCommonPropertiesPageRoutingModule
  ],
  declarations: [ShowAllCommonPropertiesPage]
})
export class ShowAllCommonPropertiesPageModule {}
