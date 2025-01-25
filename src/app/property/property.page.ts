import { Component, OnInit } from '@angular/core';
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
  imports: [IonicModule, GoBackComponent, FooterComponent,CommonModule],
})
export class PropertyPage implements OnInit {
  propertyId: number | null = null;
  properties: any[] = [];
  swiper: Swiper | undefined;
  baseUrl = 'http://65.0.7.21/ksjabalpur/';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();

    // Accessing propertyId using bracket notation
    if (navigation?.extras.state && (navigation.extras.state as any)['propertyId']) {
      this.propertyId = (navigation.extras.state as any)['propertyId'];
    }

    if (this.propertyId) {
      this.fetchPropertyDetails(this.propertyId);
    }

    // Initialize Swiper
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
      data => {
        console.log('API Response:', data);
    
        // Assuming data is a single property object, not an array
        if (data.main_img_path) {
          // Prepend base URL to the 'main_img_path' and other image paths
          data.main_img_path = this.baseUrl + data.main_img_path;
          if (data.image_paths) {
            data.image_paths = this.baseUrl + data.image_paths;
          }
        }
    
        // Set the properties object to the fetched data
        this.properties = [data];  // Wrap the single property in an array
    
        // Log the updated property for confirmation
        console.log('Updated property with full image paths:', this.properties);
      },
      error => {
        console.error('Error fetching property details:', error);
      }
    );
  }
}
