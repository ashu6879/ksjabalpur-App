
interface CategoryItem {
  main_img_path?: string; // Assuming main_img_path is an optional string
  // Add other properties that the item might have
}
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
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, SidebarComponent,CommonModule],
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {
  private autoplayId: any; 
  userId: string | null = null;
  favoriteProperties: Set<number> = new Set();
  getbuilderswiper:  Swiper | undefined;
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
  activeCategory: any;
  // Base URL for the image
  baseUrl = 'https://vibrantlivingblog.com/ksjabalpur/';

  constructor(
    private navController: NavController,
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
      slidesPerView: 1,
      spaceBetween: 10,
      loop: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }, 500);

  // Initialize the second Swiper (3 slides per view)
  setTimeout(() => {
    this.swiper2 = new Swiper('.swiper-container.second-slider', {
      slidesPerView: 3,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      observer: true,
      observeParents: true,
      autoplay: false,
    });

    // Start custom autoplay for the second swiper
    const autoplayInterval = 3000;
    this.startAutoplayForSecondSlider(autoplayInterval);
  }, 500);

  document.addEventListener('click', this.handleOutsideClick.bind(this));
}

// Move this function outside `ngAfterViewInit`
startAutoplayForSecondSlider(interval: number) {
  console.log("Starting custom autoplay for second swiper...");

  this.autoplayId = setInterval(() => {
    if (this.swiper) {
      const totalSlides = this.swiper.slides.length;
      const currentSlideIndex = this.swiper.realIndex;

      if (currentSlideIndex === totalSlides - 1) {
        this.swiper.slideTo(0);
        console.log("Reached last slide, moving to first.");
      } else {
        this.swiper.slideNext();
        console.log("Slide moved to the next.");
      }
    }
  }, interval);
}

// Move this function outside `ngAfterViewInit`
stopAutoplayForSecondSlider() {
  if (this.autoplayId) {
    clearInterval(this.autoplayId);
    console.log("Autoplay for second swiper stopped.");
  }
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
        console.log("abc is",abc)
        if (Array.isArray(abc)) {
          // Handle array response
          this.categories = abc.map((item) => {
            return { 
              id: item.id, 
              name: item.Category, 
              category_logo: item.category_logo ? this.baseUrl + item.category_logo : 'assets/industrial.png' 
            }; 
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
    this.activeCategory = category; // Set the selected category as active
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
          (responseData.data as CategoryItem[]).forEach((item) => {
            if (item.main_img_path) {
              item.main_img_path = `${this.baseUrl}${item.main_img_path}`;
            }
          });
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
    console.log("Initializing Swiper...");

    this.getbuilderswiper = new Swiper('.getBuilder-slider', {
      slidesPerView: 2,    // Show two slides at a time
      spaceBetween: 20,     // Adjust space between slides
      loop: true,           // Enable infinite loop (internal looping)
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      observer: true,       // Enable the observer
      observeParents: true, // Enable observing parent elements
      autoplay: false,      // Disable the built-in autoplay
    });

    // Manually trigger autoplay using setInterval
    const autoplayInterval = 3000; // Time between slide transitions in ms (3000ms = 3 seconds)

    this.startAutoplay(autoplayInterval); // Start the custom autoplay

    if (this.getbuilderswiper) {
      console.log("Swiper initialized successfully.");
    } else {
      console.log("Swiper initialization failed.");
    }
  }

  // Custom autoplay logic
  startAutoplay(interval: number) {
    console.log("Starting custom autoplay...");

    // Set an interval to move to the next slide
    this.autoplayId = setInterval(() => {
      if (this.getbuilderswiper) {
        const totalSlides = this.getbuilderswiper.slides.length;
        const currentSlideIndex = this.getbuilderswiper.realIndex;

        // If we reach the last slide, go back to the first slide to loop
        if (currentSlideIndex === totalSlides - 1) {
          this.getbuilderswiper.slideTo(0); // Move to the first slide
          console.log("Reached last slide, moving to first.");
        } else {
          this.getbuilderswiper.slideNext(); // Move to the next slide
          console.log("Slide moved to the next.");
        }
      }
    }, interval);
  }

  // If you want to stop autoplay at some point (e.g., when the user interacts)
  stopAutoplay() {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      console.log("Autoplay stopped.");
    }
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
  goToshowAllbuilder() {
    console.log("Builder data:", this.builders);
  
    // Assuming you want to send `this.builders` (which holds the builder data) to another page
    this.navController.navigateForward(['/show-all-builders'], {
      state: { builderData: this.builders }  // Passing the builder data to the target page
    });
  }
  goToshowAllProperty(type: string): void {
    console.log('Parameter received:', type);
  
    let dataToSend: any;
  
    // Check if the passed parameter matches a specific value
    if (type === 'recentlyadded') {
      console.log('Sending recently added properties:', this.Recentproperties);
      dataToSend = this.Recentproperties; // Send recently added properties data
    } else if (type === 'Todaydeal') {
      console.log('Sending Todaydeal properties:', this.properties);
      dataToSend = this.properties; // Send Todaydeal properties data
    } else if (type === 'featured') {
      console.log('Sending featured properties:', this.properties);
      dataToSend = this.properties; // Send featured properties data
    } else {
      console.error('Unknown type, sending default properties');
    }
  
    // Now pass the correct data to the target page
    this.navController.navigateForward(['/show-all-common-properties'], {
      state: { propertyData: dataToSend }  // Sending the data that was selected based on type
    });
  }
}
