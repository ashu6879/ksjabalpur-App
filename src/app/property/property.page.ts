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
import { Storage } from '@ionic/storage-angular';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-property',
  templateUrl: './property.page.html',
  styleUrls: ['./property.page.scss'],
  standalone: true,
  imports: [IonicModule, GoBackComponent, FooterComponent, CommonModule],
})
export class PropertyPage implements OnInit, AfterViewInit {
  userId: string | null = null;
  favoriteProperties: Set<number> = new Set();
  propertyId: number | null = null; // Store property ID
  properties: any[] = [];
  swiper: Swiper | undefined;
  baseUrl = 'http://65.0.7.21/ksjabalpur/';

  constructor(
    private storage: Storage,
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const navigationState = history.state;
  
    if (navigationState && navigationState.propertyId) {
      this.propertyId = navigationState.propertyId;
      console.log('Received property ID:', this.propertyId);
  
      // Call fetchPropertyDetails only if propertyId is not null
      if (this.propertyId !== null) {
        await this.fetchPropertyDetails(this.propertyId);
      }
    } else {
      console.error('No property ID found in navigation state');
    }
  
    try {
      await this.storage.create(); // Ensure storage is initialized properly
      this.userId = await this.storage.get('user_id');
  
      if (this.userId) {
        console.log('User ID found:', this.userId);
        // this.checkFavoriteProperties(this.userId);
      } else {
        console.warn('User ID not found in storage.');
      }
    } catch (error) {
      console.error('Error initializing storage or fetching user ID:', error);
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
      // async toggleIcon(event: Event, property: any): Promise<void> {
  //   event.stopPropagation();  // Prevent the click from triggering goToPropertyDetails
  
  //   // Retrieve the user_id from Ionic Storage
  //   const userId = await this.storage.get('user_id');
    
  //   if (!userId) {
  //     console.log('No user_id found');
  //     return;
  //   }
  
  //   // Check if the property is already a favorite
  //   if (this.favoriteProperties.has(property.property_id)) {
  //     this.favoriteProperties.delete(property.property_id);  // Remove if already filled
  //     console.log(`Removed from favorites: ${property.property_id}`);
  //   } else {
  //     // Add the property to favorites
  //     this.favoriteProperties.add(property.property_id);
  //     console.log(`Added to favorites: ${property.property_id}`);
  
  //     // Make an API call to add the favorite property
  //     this.addToFavorites(userId, property.property_id);
  //   }
  // }
  
  // // API call to add a favorite property
  // addToFavorites(userId: string, propertyId: string): void {
  //   const url = ROUTES.ADD_FAVOURITE;  // Replace with your actual API URL
  
  //   const body = {
  //     user_id: userId,
  //     property_id: propertyId
  //   };
  
  //   // Optionally, set headers if needed
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });
  
  //   this.http.post(url, body, { headers }).subscribe(
  //     (response) => {
  //       console.log('API Response:', response);
  //     },
  //     (error) => {
  //       console.error('API Error:', error);
  //     }
  //   );
  // }
  // checkFavoriteProperties(userId: string): void {
  //   const url = 'YOUR_API_URL';  // Replace with your actual API URL
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });

  //   // Make a GET request to fetch the user's favorite properties
  //   this.http.get<any[]>(`${url}/favorites?user_id=${userId}`, { headers })
  //     .subscribe(
  //       (response) => {
  //         // Assuming response contains an array of property IDs that are favorites
  //         this.favoriteProperties.clear();
  //         response.forEach(favorite => {
  //           this.favoriteProperties.add(favorite.property_id);
  //         });
  //         console.log('Favorite properties loaded:', this.favoriteProperties);
  //       },
  //       (error) => {
  //         console.error('Error fetching favorite properties:', error);
  //       }
  //     );
  // }

  // async isIconFilled(property: any): Promise<boolean> {
  //   // Retrieve the user_id from storage
  //   const userId = await this.storage.get('user_id');
  //   if (userId) {
  //     // If favoriteProperties is already populated, check it
  //     if (this.favoriteProperties.has(property.property_id)) {
  //       return true;
  //     } else {
  //       // If not, fetch the user's favorites from the API
  //       this.checkFavoriteProperties(userId);
  //       return this.favoriteProperties.has(property.property_id);
  //     }
  //   }
  //   return false;
  // }
  // Fetch favorite properties for the user
  // checkFavoriteProperties(userId: string): void {
  //   const url = `${ROUTES.FETCH_FAVORITES}?user_id=${userId}`; // Replace with your actual endpoint

  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   this.http.get<any[]>(url, { headers }).subscribe(
  //     (response) => {
  //       this.favoriteProperties.clear();
  //       response.forEach((favorite) => {
  //         this.favoriteProperties.add(favorite.property_id);
  //       });
  //       console.log('Loaded favorite properties:', this.favoriteProperties);
  //     },
  //     (error) => {
  //       console.error('Error fetching favorite properties:', error);
  //     }
  //   );
  // }

  // Toggle favorite property
  async toggleIcon(event: Event, property: any): Promise<void> {
    event.stopPropagation();
    this.userId = await this.storage.get('user_id');
    if (!this.userId) {
      console.error('User ID not found in storage.');
      return;
    }
  
    const propertyId = property[0].property_id; // Keep using property[0]
  
    // Toggle the property in the favorites set
    if (this.favoriteProperties.has(propertyId)) {
      this.favoriteProperties.delete(propertyId);
      console.log(`Removed from favorites: ${propertyId}`);
      // Uncomment and use the following to remove it from the backend
      // this.removeFromFavorites(this.userId, propertyId);
    } else {
      this.favoriteProperties.add(propertyId);
      console.log(`Added to favorites: ${propertyId}`);
      // Uncomment and use the following to add it to the backend
      // this.addToFavorites(this.userId, propertyId);
    }
  }

  // Add to favorites API call
  // addToFavorites(userId: string, propertyId: number): void {
  //   const url = ROUTES.ADD_FAVORITE; // Replace with your actual endpoint

  //   const body = { user_id: userId, property_id: propertyId };
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   this.http.post(url, body, { headers }).subscribe(
  //     (response) => {
  //       console.log('Added to favorites successfully:', response);
  //     },
  //     (error) => {
  //       console.error('Error adding to favorites:', error);
  //     }
  //   );
  // }

  // Remove from favorites API call
  // removeFromFavorites(userId: string, propertyId: number): void {
  //   const url = `${ROUTES.REMOVE_FAVORITE}`; // Replace with your actual endpoint

  //   const body = { user_id: userId, property_id: propertyId };
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   this.http.post(url, body, { headers }).subscribe(
  //     (response) => {
  //       console.log('Removed from favorites successfully:', response);
  //     },
  //     (error) => {
  //       console.error('Error removing from favorites:', error);
  //     }
  //   );
  // }

  // Check if the icon should be filled
  isIconFilled(property: any): boolean {
    // Ensure property is not undefined and has at least one element
    if (property && property.length > 0) {
      const propertyId = property[0].property_id;  // Access property_id safely
      return this.favoriteProperties.has(propertyId);  // Return true if property is in favorites
    } else {
      return false;  // Return false if property is undefined or empty
    }
  }
  downloadPdf() {
    const property = this.properties[0];
  
    // Initialize jsPDF instance
    const doc = new jsPDF();
  
    // Add Logo at the top center (adjust coordinates for your image dimensions)
    const logoPath = '../assets/logo.png'; // Replace with your logo image path
    doc.addImage(logoPath, 'PNG', 85, 10, 30, 30); // Logo at the top center
  
    // Set Title font (larger and bold for impact)
    doc.setFontSize(24);
    doc.text("Property Details", 20, 65); // Positioned just below the logo
  
    // Draw a subtle line under the title
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200); // Light gray line
    doc.line(20, 70, 190, 70); // Line across the page
    
    // Add some padding space between title and content
    doc.setFontSize(12);
  
    // Property Information - Use a well-structured layout with better spacing
    const yOffset = 80;
    doc.text(`Property ID: ${property.property_id}`, 20, yOffset);
    doc.text(`Property Name: ${property.property_name}`, 20, yOffset + 10);
    doc.text(`Address: ${property.property_address}`, 20, yOffset + 20);
    doc.text(`Area: ${property.property_area}`, 20, yOffset + 30);
    doc.text(`Current Price: ${property.current_price}`, 20, yOffset + 40);
    doc.text(`Previous Price: ${property.previous_price}`, 20, yOffset + 50);
    doc.text(`Builder Name: ${property.builder_name}`, 20, yOffset + 60);
    doc.text(`Finance Approval: ${property.finance_aproval}`, 20, yOffset + 70);
    doc.text(`Construction Date: ${property.constructed_date}`, 20, yOffset + 80);
  
    // Add a thicker line after property details for separation
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0); // Black line for clear separation
    doc.line(20, yOffset + 90, 190, yOffset + 90); // Line across the page
  
    // Check if images exist and add them dynamically
    if (property.image_paths && property.image_paths.length > 0) {
      // First image (on the left side)
      doc.addImage(property.image_paths[0], "JPEG", 20, yOffset + 100, 80, 60);
  
      // Second image (on the right side, adjust if necessary)
      if (property.image_paths[1]) {
        doc.addImage(property.image_paths[1], "JPEG", 110, yOffset + 100, 80, 60);
      }
    }
  
    // Add a final line after the images for balance
    doc.setLineWidth(1);
    doc.line(20, yOffset + 170, 190, yOffset + 170);
  
    // Footer - add company name, contact, or other info, and page number
    doc.setFontSize(10);
    doc.text("Generated by [Your Company Name]", 20, 250);  // Company or footer info
    doc.text(`Page 1`, 180, 250);  // Add a page number for future multiple-page PDFs
  
    // Save the PDF with a refined file name
    doc.save(`${property.property_name}_Details.pdf`);
  }
  
}
