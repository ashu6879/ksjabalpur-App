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
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, SidebarComponent,CommonModule],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  userId: string | null = null;
  favoriteProperties: Set<number> = new Set();
  swiper: Swiper | undefined;
  swiper2: Swiper | undefined;
  noPropertiesFound: boolean = false; // Variable to track if properties are found
  images: string[] = []; // Array to hold image URLs
  categories: any[] = []; // Your categories array
  builder: any[] = []; // Your categories array
  properties: any[] = [];  // Array to store the property data
  Recentproperties: any[] = [];  // Array to store the property data
  builders: any[] = []; // Will hold the API data
  isMenuOpen: boolean = false;
  // Base URL for the image
  baseUrl = 'https://vibrantlivingblog.com/ksjabalpur/';

  constructor(
    private storage: Storage,
    private router: Router,
    private menuCtrl: MenuController,
    private http: HttpClient // Inject HttpClient
  ) {}
  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      location.reload();
    }, 2000);
  }
  

  async ngOnInit() {
    this.menuCtrl.isOpen().then((isOpen) => {
      this.isMenuOpen = isOpen;
    });
    this.fetchImages(); // Call fetchImages when the component is initialized
    this.fetchCategories();
    this.fetchProperties();
    this.fetchTodaydeal();
    this.fetchRecentlyAdded();
    this.fetchBuilderAndInitializeSwiper();
    await this.storage.create();
    this.userId = await this.storage.get('user_id');
    if (this.userId) {
      this.checkFavoriteProperties(this.userId);
    } else {
      console.warn('User ID not found in storage.');
    }
  }

  ngAfterViewInit() {
    // Initialize the first Swiper (1 slide per view)
    setTimeout(() => {
      this.swiper = new Swiper('.swiper-container.first-slider', {
        slidesPerView: 1,  // Show one slide per view
        spaceBetween: 10,
        loop: false,  // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true,  // Enable clicking on dots
        },
      });
      // //console.log('First Swiper initialized:', this.swiper);
    }, 500);  // Delay to ensure images are loaded before initializing Swiper
  
    // Initialize the second Swiper (3 slides per view)
    setTimeout(() => {
      this.swiper2 = new Swiper('.swiper-container.second-slider', {
        slidesPerView: 3,  // Show three slides per view
        spaceBetween: 20,  // Space between slides
        loop: false,  // Enable infinite loop
        pagination: {
          el: '.swiper-pagination',
          clickable: true,  // Enable clicking on dots
        },
      });
      // //console.log('Second Swiper initialized:', this.swiper2);
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
        // //console.log("Fetched Data:", data); // Log the entire response to inspect the structure
  
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
  
          // //console.log("Processed Image URLs:", this.images); // Log the processed image URLs
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
    const apiUrl = ROUTES.PROPERTY_CATEGORY; // Replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245', // Add the Authorization header
    });
  
    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (responce) => {
        //console.log('my API Response:', responce);
        const abc = responce.data;
        //console.log("abc is",abc)
        if (Array.isArray(abc)) {
          // Handle array response
          this.categories = abc.map((item) => {
            return { id: item.id, name: item.Category }; // Make sure the object contains 'id' and 'name'
          });
        } else if (abc && abc.Category) {
          // Handle single object response
          this.categories = [{ id: abc.id, name: abc.Category }];
        } else {
          console.error('Unexpected API response structure:', abc);
        }
        // //console.log('Processed Categories:', this.categories);
      },
      error: (err) => {
        console.error('API call failed:', err);
      },
    });
  }
    
  // Handle category click
  goToCategory(category: { id: string; name: string }) {
    if (category && category.id) {
      // //console.log('Category clicked:', category.id);
      // //console.log('Category Name:', category.name);
  
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
          //console.log('Fetched category data:', responseData);
          const combinedData = {
            categoryId: category.id,           // Category ID
            categoryName: category.name,       // Category Name
            categoryData: responseData.data,   // Fetched category data
          };
          // Check if the response status is false and data is 'no'
          if (responseData.status === false && responseData.data === 'no') {
            //console.log('No properties found');
            this.noPropertiesFound = true;  // Set the flag to true
            return; // Exit the function and skip navigation
          } else {
            // Reset noPropertiesFound to false if data is found
            this.noPropertiesFound = false;
  
            // Proceed with navigation, passing fetched data as state
            this.router.navigate([`/common-property-page/`], {
              state: { combinedData: combinedData },
            }).then(() => {
              //console.log('Navigation successful to category page with data:', responseData.data);
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
  
    this.http.get<any[]>(apiUrl, { headers }).subscribe(response => {
      const recentdata = response;
      this.properties = recentdata.map(property => {
        // Prepend the base URL to the main_img_path
        if (property.main_img_path) {
          property.main_img_path = this.baseUrl + property.main_img_path;
        }
        return property;
      });
      
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
    this.http.get<any[]>(apiUrl, { headers }).subscribe(response =>{
      // console.log("responce", response); // Log to confirm the data
      const recentdata = response;
      this.properties = recentdata.map(property => {
        // Prepend the base URL to the main_img_path
        if (property.main_img_path) {
          property.main_img_path = this.baseUrl + property.main_img_path;
        }
        return property;
      });
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
    const apiUrl = ROUTES.RECENT_PROPERTY; // Replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245', // Add the Authorization header
    });
  
    this.http.get<{ data: any[] }>(apiUrl, { headers }).subscribe(response => {
      const recentdata = response.data;
      this.Recentproperties = recentdata.map(Recentproperties => {
        // Prepend the base URL to the main_img_path
        if (Recentproperties.main_img_path) {
          Recentproperties.main_img_path = this.baseUrl + Recentproperties.main_img_path;
        }
        return Recentproperties;
      });
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
    this.http.get<any>(apiUrl, { headers }).subscribe(
      (response) => {
        // Log the full response to the console
        //console.log('Response data from API:', response);
  
        // Check if response contains expected data
        if (response && response.data && Array.isArray(response.data)) {
          //console.log('Builders data:', response.data);
  
          this.builders = this.addBaseUrlToImages(response.data);  // Add base URL to image paths
          // //console.log('Builders with base URLs:', this.builders);  // Log the builders with added base URL
  
          this.initializeSwiper();  // Initialize Swiper after data is fetched
        } else {
          console.warn('Unexpected response format:', response);
        }
      },
      (error) => {
        console.error('Error fetching data from API:', error);
      }
    );
  }
  goToBuilder(builder: { id: string; name: string }) {
    if (builder && builder.id) {
      //console.log('Category clicked:', builder.id);
      //console.log('Category Name:', builder.name);
  
      // Proceed with navigation, passing builder id and name as state
      this.router.navigate([`/all-builders/`], {
        state: {
          builderID: builder.id,
          builderName: builder.name
        },
      }).then(() => {
        //console.log('Navigation successful to category page');
      }).catch((err) => {
        console.error('Navigation error:', err);
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

  goToPropertyDetails(propertyId: number): void {
    console.log("id is",propertyId)
    this.router.navigate(['/property'], { state: { propertyId: propertyId } });
  }
  // Fetch favorite properties for the user
  checkFavoriteProperties(userId: string): void {
    const url = ROUTES.CHECK_FAVOURITE; // Replace with your actual endpoint
  
    const body = { user_id: userId }; // Send user_id in the body
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http.post<any>(url, body, { headers }).subscribe(
      (response) => {
        console.log("Favorite is", response.message);
  
        const favoriteArray = response.message; // Extract the message array
        this.favoriteProperties.clear(); // Clear the current properties
  
        if (Array.isArray(favoriteArray) && favoriteArray.length > 0) {
          favoriteArray.forEach((favoriteProperty) => {
            if (favoriteProperty.id) {
              this.favoriteProperties.add(favoriteProperty.id); // Add each property_id
            }
          });
        }
  
        console.log('Loaded favorite properties:', this.favoriteProperties);
      },
      (error) => {
        console.error('Error fetching favorite properties:', error);
      }
    );
  }

  // Toggle favorite property
  async toggleIcon(event: Event, property: any): Promise<void> {
    event.stopPropagation();

    if (!this.userId) {
      console.error('User ID not found in storage.');
      return;
    }

    const propertyId = property.property_id;

    if (this.favoriteProperties.has(propertyId)) {
      this.favoriteProperties.delete(propertyId);
      console.log(`Removed from favorites: ${propertyId}`);
      this.removeFromFavorites(this.userId, propertyId);
    } else {
      this.favoriteProperties.add(propertyId);
      console.log(`Added to favorites: ${propertyId}`);
      this.addToFavorites(this.userId, propertyId);
    }
  }

  // Add to favorites API call
  // Add to favorites API call
  addToFavorites(userId: string, propertyId: number): void {
    const url = ROUTES.ADD_FAVOURITE; // Replace with your actual endpoint
    const iconAction="add";
    const body = { user_id: userId, property_id: propertyId,action:iconAction};
    console.log(body);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(url, body, { headers }).subscribe(
      (response) => {
        console.log('Added to favorites successfully:', response);
      },
      (error) => {
        console.error('Error adding to favorites:', error);
      }
    );
  }

  // Remove from favorites API call
  removeFromFavorites(userId: string, propertyId: number): void {
    const url = `${ROUTES.ADD_FAVOURITE}`; // Replace with your actual endpoint
    const iconAction="remove";
    const body = { user_id: userId, property_id: propertyId,action:iconAction};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(url, body, { headers }).subscribe(
      (response) => {
        console.log('Removed from favorites successfully:', response);
      },
      (error) => {
        console.error('Error removing from favorites:', error);
      }
    );
  }

  // Check if the icon should be filled
  isIconFilled(property: any): boolean {
    return this.favoriteProperties.has(property.property_id);
  }
}
