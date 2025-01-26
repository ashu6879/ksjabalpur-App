import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GoBackComponent } from '../components/go-back/go-back.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common'; 
import Swiper from 'swiper';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
  standalone: true,
  imports: [IonicModule, GoBackComponent, FooterComponent, CommonModule],
})
export class PropertyPage implements OnInit, AfterViewInit {
  propertyId: number | null = null; // Store property ID
  properties: any[] = [];
  swiper: Swiper | undefined;
  baseUrl = 'http://65.0.7.21/ksjabalpur/';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const navigationState = history.state;
  
    if (navigationState && navigationState.propertyId) {
      this.propertyId = navigationState.propertyId;
      console.log('Received property ID:', this.propertyId);
  
      // Call fetchPropertyDetails only if propertyId is not null
      if (this.propertyId !== null) {
        this.fetchPropertyDetails(this.propertyId);
      }
    } else {
      console.error('No property ID found in navigation state');
    }
  }

  ngAfterViewInit(): void {
    // Initialize Swiper after the view is initialized or after properties are updated
    this.cdr.detectChanges(); // Ensure the view is fully initialized before swiper setup
    this.initializeSwiper();
  }

  goBack(): void {
    this.location.back();
  }

  fetchPropertyDetails(propertyId: number): void {
    const apiUrl = ROUTES.PROPERTY_DETAILS;
    const headers = new HttpHeaders({
      'Authorization': '2245',
      'Content-Type': 'application/json',
    });

    const body = { property_id: propertyId };

    this.http.post<any>(apiUrl, body, { headers }).subscribe(
      response => {
        const propertyData = response.data;
        console.log('API Response:', response.data);

        // Update image paths with base URL
        if (propertyData.main_img_path) {
          propertyData.main_img_path = this.baseUrl + propertyData.main_img_path;
        }
        if (propertyData.image_paths) {
          // console.log(propertyData.image_paths)
          propertyData.image_paths = propertyData.image_paths.map((path: string) => this.baseUrl + path);
        }

        // Assign the fetched data to properties array
        this.properties = [propertyData];
        console.log('Updated property details:', this.properties);

        // After properties are updated, refresh the swiper
        this.cdr.detectChanges(); // Detect changes after fetching data
        this.initializeSwiper(); // Reinitialize or refresh Swiper
      },
      error => {
        console.error('Error fetching property details:', error);
      }
    );
  }

  initializeSwiper(): void {
    if (!this.swiper) {
      // Ensure that the swiper container is available
      const swiperContainer = document.querySelector('.image-slider');
      
      // If the swiper container exists, initialize Swiper
      if (swiperContainer) {
        this.swiper = new Swiper('.image-slider', {
          slidesPerView: 1,
          spaceBetween: 10,
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        });
      } else {
        console.error('Swiper container not found');
      }
    } else {
      // If swiper is already initialized, update it
      this.swiper.update();
    }
  }
}
