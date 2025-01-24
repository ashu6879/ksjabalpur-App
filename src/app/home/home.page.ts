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
  noPropertiesFound: boolean = false; // Variable to track if properties are found
  images: string[] = []; // Array to hold image URLs
  categories: any[] = []; // Your categories array
  builder: any[] = []; // Your categories array
  properties: any[] = [];  // Array to store the property data
  builders: any[] = []; // Will hold the API data
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
    this.fetchProperties();
    this.fetchTodaydeal();
    this.fetchRecentlyAdded();
    this.fetchBuilderAndInitializeSwiper();
  }

  ngAfterViewInit() {
    // Initialize the first Swiper (1 slide per view)
    setTimeout(() => {
      this.swiper = new Swiper('.swiper-container.first-slider', {
        slidesPerView: 1,  // Show one slide per view
        spaceBetween: 10,
        loop: true,  // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true,  // Enable clicking on dots
        },
      });
      // console.log('First Swiper initialized:', this.swiper);
    }, 500);  // Delay to ensure images are loaded before initializing Swiper
  
    // Initialize the second Swiper (3 slides per view)
    setTimeout(() => {
      this.swiper2 = new Swiper('.swiper-container.second-slider', {
        slidesPerView: 3,  // Show three slides per view
        spaceBetween: 20,  // Space between slides
        loop: true,  // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true,  // Enable clicking on dots
        },
      });
      // console.log('Second Swiper initialized:', this.swiper2);
    }, 500);  // Delay to ensure images are loaded before initializing Swiper
    // Listen for clicks outside (optional functionality)
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
    // interface CategoryResponse {
    //   id: string;
    //   Category: string;
    //   created_on: string;
    // }
  
    const apiUrl = ROUTES.PROPERTY_CATEGORY; // Replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245', // Add the Authorization header
    });
  
    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (data) => {
        // console.log('API Response:', data);
    
        if (Array.isArray(data)) {
          // Handle array response
          this.categories = data.map((item) => {
            return { id: item.id, name: item.Category }; // Make sure the object contains 'id' and 'name'
          });
        } else if (data && data.Category) {
          // Handle single object response
          this.categories = [{ id: data.id, name: data.Category }];
        } else {
          console.error('Unexpected API response structure:', data);
        }
        // console.log('Processed Categories:', this.categories);
      },
      error: (err) => {
        console.error('API call failed:', err);
      },
    });
  }
    
  // Handle category click
  goToCategory(category: { id: string; name: string }) {
    if (category && category.id) {
      // console.log('Category clicked:', category.id);
      // console.log('Category Name:', category.name);
  
      // Call POST API to fetch data for the selected category
      const apiUrl = ROUTES.PROPERTY_CAT_BYID; // Replace with actual API URL
      const headers = new HttpHeaders({
        'Authorization': '2245', // Replace with your actual Authorization token if needed
      });
  
      const body = {
        categoryId: category.id, // Send categoryId as part of the body
      };
  
      // Send POST request to fetch category data
      this.http.post<any>(apiUrl, body, { headers }).subscribe({
        next: (responseData) => {
          console.log('Fetched category data:', responseData);
          const combinedData = {
            categoryId: category.id,           // Category ID
            categoryName: category.name,       // Category Name
            categoryData: responseData.data,   // Fetched category data
          };
          // Check if the response status is false and data is 'no'
          if (responseData.status === false && responseData.data === 'no') {
            console.log('No properties found');
            this.noPropertiesFound = true;  // Set the flag to true
            return; // Exit the function and skip navigation
          } else {
            // Reset noPropertiesFound to false if data is found
            this.noPropertiesFound = false;
  
            // Proceed with navigation, passing fetched data as state
            this.router.navigate([`/common-property-page/`], {
              state: { combinedData: combinedData },
            }).then(() => {
              console.log('Navigation successful to category page with data:', responseData.data);
            }).catch((err) => {
              console.error('Navigation error:', err);
            });
          }
        },
        error: (err) => {
          console.error('API request failed:', err); // Handle any error from the API request
        },
      });
    } else {
      console.error('Invalid category object:', category); // Log an error if category doesn't have id
    }
  }

  fetchProperties() {
    const apiUrl = ROUTES.FEATURED_PROPERTY; // Replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245', // Add the Authorization header
    });
    this.http.get<any[]>(apiUrl, { headers }).subscribe(data => {
      this.properties = data;
      this.initializePropertySlider();
    });
  }
  initializePropertySlider() {
    setTimeout(() => {
      new Swiper('.property-slider', {
        slidesPerView: 1,   // Display three slides at a time
        spaceBetween: 10,    // Space between slides
        loop: false,          // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true,  // Enable clicking on dots
        },
      });
    }, 500);  // Delay to ensure images are loaded before initializing Swiper
  }  

  fetchTodaydeal() {
    const apiUrl = ROUTES.FEATURED_PROPERTY; // Replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245', // Add the Authorization header
    });
    this.http.get<any[]>(apiUrl, { headers }).subscribe(data => {
      this.properties = data;
      this.initializeTodayDealSlider();
    });
  }
  initializeTodayDealSlider() {
    setTimeout(() => {
      new Swiper('.todayDeal-slider', {
        slidesPerView: 1,   // Display three slides at a time
        spaceBetween: 10,    // Space between slides
        loop: false,          // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true,  // Enable clicking on dots
        },
      });
    }, 500);  // Delay to ensure images are loaded before initializing Swiper
  }  

  fetchRecentlyAdded() {
    const apiUrl = ROUTES.All_PROPERTY; // Replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245', // Add the Authorization header
    });
    this.http.get<any[]>(apiUrl, { headers }).subscribe(data => {
      this.properties = data;
      this.initializeRecentlySlider();
    });
  }
  initializeRecentlySlider() {
    setTimeout(() => {
      new Swiper('.Recentlyadded-slider', {
        slidesPerView: 1,   // Display three slides at a time
        spaceBetween: 10,    // Space between slides
        loop: false,          // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true,  // Enable clicking on dots
        },
      });
    }, 500);  // Delay to ensure images are loaded before initializing Swiper
  }  

  // Function to fetch data and initialize swiper
  fetchBuilderAndInitializeSwiper() {
    const apiUrl = ROUTES.GET_BUILDERS;  // Replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245',  // Add the Authorization header
    });

    // Fetch builders data
    this.http.get<any[]>(apiUrl, { headers }).subscribe(
      (response) => {
        this.builders = this.addBaseUrlToImages(response);  // Add base URL to image paths
        this.initializeSwiper();  // Initialize Swiper after data is fetched
      },
      (error) => {
        console.error('Error fetching data from API:', error);
      }
    );
  }
    
  goToBuilder(builder: { id: string; name: string }) {
    if (builder && builder.id) {
      console.log('Category clicked:', builder.id);
      console.log('Category Name:', builder.name);
  
      const apiUrl = ROUTES.BUILDER_BYID; // Replace with actual API URL
      const headers = new HttpHeaders({
        'Authorization': '2245', // Replace with your actual Authorization token if needed
      });
  
      const body = {
        builder_id: builder.id, // Send builderId as part of the body
      };
  
      this.http.post<any>(apiUrl, body, { headers }).subscribe({
        next: (responseData) => {
          console.log('Fetched category data:', responseData);
  
          const combinedData = {
            builderID: builder.id,
            builderName: builder.name,
            builderData: responseData.message || [], // Ensure builderData is an array
          };
  
          // Check if the response status is false and data is 'no'
          if (responseData.status === false && responseData.message === 'no') {
            console.log('No Builders found');
            this.noPropertiesFound = true;  // Set the flag to true
          } else {
            this.noPropertiesFound = false;
          }
  
          // Proceed with navigation, passing fetched data and noPropertiesFound flag as state
          this.router.navigate([`/all-builders/`], {
            state: {
              combinedData: combinedData,
              noPropertiesFound: this.noPropertiesFound, // Pass the flag
            },
          }).then(() => {
            console.log('Navigation successful to category page with data:', responseData.message);
          }).catch((err) => {
            console.error('Navigation error:', err);
          });
        },
        error: (err) => {
          console.error('API request failed:', err); // Handle any error from the API request
        },
      });
    } else {
      console.error('Invalid category object:', builder);
    }
  }
  // Function to add the base URL to image paths
  addBaseUrlToImages(builders: any[]) {
    return builders.map(builder => {
      builder.BuilderLogo = this.baseUrl + builder.BuilderLogo; // Add base URL to image path
      return builder;
    });
  }

  // Function to initialize Swiper
  initializeSwiper() {
    setTimeout(() => {
      this.swiper = new Swiper('.getBuilder-slider', {
        slidesPerView: 2,  // Show two slides at a time
        spaceBetween: 20,  // Adjust space between slides
        loop: false,         // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }, 500);  // Delay to ensure images are loaded before initializing Swiper
  }
  
}
