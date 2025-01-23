import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FooterComponent } from '../components/footer/footer.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, SidebarComponent,CommonModule],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  swiper: Swiper | undefined;
  swiper2: Swiper | undefined;
  images: string[] = []; // Array to hold image URLs
  categories: string[] = []; // Array to hold category names
  isMenuOpen: boolean = false;
  // Base URL for the image
  baseUrl = 'http://65.0.7.21/ksjabalpur/';

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private http: HttpClient // Inject HttpClient
  ) {}

  ngOnInit() {
    this.menuCtrl.isOpen().then((isOpen) => {
      this.isMenuOpen = isOpen;
    });
    this.fetchImages(); // Call fetchImages when the component is initialized
    this.fetchCategories();
  }

  ngAfterViewInit() {
    // Initialize Swiper after images are fetched
    setTimeout(() => {
      this.swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: true, // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true, // Enable clicking on dots
        },
      });
      // console.log('Swiper initialized:', this.swiper);
    }, 500);  // Delay to ensure images are loaded before initializing Swiper

      // Initialize Swiper after images are fetched
      setTimeout(() => {
        this.swiper2 = new Swiper('.swiper-container', {
          slidesPerView: 1,
          spaceBetween: 10,
          loop: true, // Enable infinite loop
          pagination: {
            el: '.swiper-pagination',
            clickable: true, // Enable clicking on dots
          },
        });
    
        // console.log('Swiper initialized:', this.swiper);
      }, 500);  // Delay to ensure images are loaded before initializing Swiper

    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleOutsideClick(event: MouseEvent) {
    const menuElement = document.querySelector('ion-menu');
    const isClickInsideMenu = menuElement?.contains(event.target as Node);

    if (!isClickInsideMenu && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  openMenu() {
    this.menuCtrl.open('mainMenu').then(() => {
      this.isMenuOpen = true;
    });
  }

  closeMenu() {
    this.menuCtrl.close('mainMenu').then(() => {
      this.isMenuOpen = false;
    });
  }

  goToCommercial() {
    this.router.navigate(['/commercial-properties']);
  }

  // Fetch images from API
  fetchImages() {
    const apiUrl = ROUTES.APP_BANNER; // Replace with your API URL
  
    // Set the Authorization header
    const headers = new HttpHeaders({
      'Authorization': '2245', // Replace with the appropriate authorization value
    });
  
    // Make the HTTP GET request with headers
    this.http.get<any[]>(apiUrl, { headers }).subscribe(
      (data) => {
        // console.log("Fetched Data:", data); // Log the entire response to inspect the structure
  
        // Ensure the response is an array and map the image paths
        if (Array.isArray(data)) {
          this.images = data.map((item) => {
            if (item.image_path) {
              return this.baseUrl + item.image_path; // Prepend the base URL to the image path
            } else {
              console.error("Missing 'image_path' in item:", item);
              return null;
            }
          }).filter((url) => url !== null); // Filter out any null entries
  
          // console.log("Processed Image URLs:", this.images); // Log the processed image URLs
        } else {
          console.error("Unexpected API response structure:", data);
        }
      },
      (error) => {
        console.error("Error fetching data:", error); // Log any errors
      }
    );
  }
  

  fetchCategories() {
    interface CategoryResponse {
      Category: string; // Ensure this matches the exact field name from the API
    }
  
    const apiUrl = ROUTES.PROPERTY_CATEGORY; // Replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245', // Add the Authorization header
    });
  
    this.http.get<CategoryResponse[]>(apiUrl, { headers }).subscribe({
      next: (data) => {
        console.log('API Response:', data);
  
        if (Array.isArray(data)) {
          // Extract the Category field into the categories array
          this.categories = data.map((item) => item.Category);
          console.log('Processed Categories:', this.categories);
        } else {
          console.error('Unexpected API response structure:', data);
        }
      },
      error: (err) => {
        console.error('API call failed:', err);
      },
    });
  }

// Handle category click
goToCategory(category: { name: string; iconUrl: string }) {
  console.log('Category clicked:', category); // Log the clicked category details
  console.log('Navigating to category:', category.name);

  // Add your navigation logic here, e.g., navigate to category page
  this.router.navigate([`/commercial-properties`]).then(() => {
    console.log('Navigation successful to:', category.name); // Confirm successful navigation
  }).catch((err) => {
    console.error('Navigation error:', err); // Log any navigation error
  });
}
}
