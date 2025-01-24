import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommonPropertyPagePageRoutingModule } from './common-property-page-routing.module';

import { CommonPropertyPagePage } from './common-property-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommonPropertyPagePageRoutingModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [CommonPropertyPagePage]
})
export class CommonPropertyPagePageModule {}
