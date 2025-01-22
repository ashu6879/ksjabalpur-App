import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommercialPropertiesPageRoutingModule } from './commercial-properties-routing.module';

import { CommercialPropertiesPage } from './commercial-properties.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommercialPropertiesPageRoutingModule
  ],
  declarations: [CommercialPropertiesPage]
})
export class CommercialPropertiesPageModule {}
