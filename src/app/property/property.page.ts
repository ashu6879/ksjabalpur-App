import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GoBackComponent } from '../components/go-back/go-back.component'; // Import GoBackComponent
import { FooterComponent } from '../components/footer/footer.component';
import { Location } from '@angular/common'; // Import Location service
import Swiper from 'swiper';

@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
  standalone: true,
  imports: [IonicModule,GoBackComponent,FooterComponent], // Import IonicModule here
})
export class PropertyPage implements OnInit {
  swiper: Swiper | undefined;

  constructor(private location: Location) { }

  ngOnInit() {
    this.swiper = new Swiper('.image-slider', {
      slidesPerView: 1, // Show one image at a time
      spaceBetween: 10, // Space between slides
      loop: true, // Enable looping of slides
      pagination: {
        el: '.swiper-pagination', // Pagination controls
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next', // Next button
        prevEl: '.swiper-button-prev'  // Previous button
      }
    });
  }
  // Navigate back to the previous page
  goBack() {
    this.location.back(); // This will navigate the user to the previous page
  }

}
