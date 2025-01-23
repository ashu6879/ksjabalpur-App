import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule  } from '@ionic/angular';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,SwiperModule
  ],
  declarations: [HomePage,SwiperModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
