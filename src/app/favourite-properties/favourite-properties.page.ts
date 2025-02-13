import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FooterComponent } from '../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common'; // Import Location service
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favourite-properties',
  templateUrl: './favourite-properties.page.html',
  styleUrls: ['./favourite-properties.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, FormsModule,CommonModule],

})
export class FavouritePropertiesPage implements OnInit {
  favouriteProperties: Set<number> = new Set();
  userId: string | null = null;
  propertyData: any[] = [];
  noFavouriteProperties: boolean = false;


  constructor(private route: ActivatedRoute,private location: Location,private router: Router,private storage: Storage,private http: HttpClient) { }

  async ngOnInit() {
    await this.storage.create();
    this.userId = await this.storage.get('user_id');
    if (this.userId) {
      console.log("user_id", this.userId);
      this.fetchFavouriteProperties(this.userId);  // Call fetchFavouriteProperties after getting userId
      this.checkFavoriteProperties(this.userId);
    } else {
      console.warn('User ID not found in storage.');
    }
  }
  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      location.reload();
    }, 2000);
  }

  fetchFavouriteProperties(userId: string): void {
    const apiUrl = ROUTES.CHECK_FAVOURITE; // Replace with actual API URL
    const body = { user_id: userId };
    const headers = new HttpHeaders({
      'Authorization': '2245',
      'Content-Type': 'application/json',
    });
  
    const baseUrl = 'https://vibrantlivingblog.com/ksjabalpur/'; // Replace with your actual base URL
  
    this.http.post<any>(apiUrl, body, { headers }).subscribe({
      next: (responseData) => {
        console.log("Fetched favourite property data:", responseData);
  
        if (responseData.message === 'No Wishlisted Properties') {
          this.propertyData = [];
          this.noFavouriteProperties = true;
        } else {
          const favoriteArray = responseData.message; // Assuming the message is an array
          this.propertyData = favoriteArray; // Store the full array for further use
          this.noFavouriteProperties = false;
  
          // Append base URL to main_img_path for each favorite property
          if (Array.isArray(favoriteArray) && favoriteArray.length > 0) {
            favoriteArray.forEach((favoriteProperty) => {
              if (favoriteProperty.main_img_path) {
                favoriteProperty.main_img_path = `${baseUrl}${favoriteProperty.main_img_path}`;
              }
  
              // Add the property ID to the Set
              if (favoriteProperty.id) {
                this.favouriteProperties.add(Number(favoriteProperty.id)); // Add each `id` to the Set
              }
            });
          }
  
          console.log('Property IDs added to favoriteProperties:', Array.from(this.favouriteProperties));
        }
      },
      error: (error) => {
        console.error('Error fetching favourite property data:', error);
        this.propertyData = [];
        this.noFavouriteProperties = true;
      }
    });
  }
  

  checkFavoriteProperties(userId: string): void {
    const url = ROUTES.CHECK_FAVOURITE; // Replace with your actual endpoint
  
    const body = { user_id: userId }; // Send user_id in the body
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http.post<any>(url, body, { headers }).subscribe(
      (response) => {
        console.log("Favorite is", response.message);
  
        const favoriteArray = response.message; // Extract the message array
        this.favouriteProperties.clear(); // Clear the current properties
  
        if (Array.isArray(favoriteArray) && favoriteArray.length > 0) {
          favoriteArray.forEach((favoriteProperty) => {
            if (favoriteProperty.id) {
              this.favouriteProperties.add(favoriteProperty.id); // Add each property_id
            }
          });
        }
  
        console.log('Loaded favorite properties:', this.favouriteProperties);
      },
      (error) => {
        console.error('Error fetching favorite properties:', error);
      }
    );
  }

  fetchFavouritebyID(favouriteProperties: any[], userId: string) {
    const apiUrl = ROUTES.CHECK_FAVOURITE;  // replace with your actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245',
      'Content-Type': 'application/json',
    });
  
    // Create an array of property IDs
    const propertyIds = favouriteProperties.map(favProperty => favProperty.id);
  
    console.log("Property IDs:", propertyIds);
  
    // Make one HTTP request with all the property IDs and userId
    this.http.post(apiUrl, { 
      property_ids: propertyIds,  // Send all property IDs in one request
      user_id: userId  // Include userId in the request body
    }, { headers }).subscribe(
      (response) => {
        // Process the response containing all the data
        console.log('Response for all properties:', response);
      },
      (error) => {
        console.error('Error fetching property details:', error);
      }
    );
  }

  goBack() {
    this.location.back(); // This will navigate the user to the previous page
  }
  // Toggle favorite property
  async toggleIcon(event: Event, property: any): Promise<void> {
    event.stopPropagation();
    this.userId = await this.storage.get('user_id');
    if (!this.userId) {
      console.error('User ID not found in storage.');
      return;
    }

    const propertyId = property.id;

    if (this.favouriteProperties.has(propertyId)) {
      this.favouriteProperties.delete(propertyId);
      console.log(`Removed from favorites: ${propertyId}`);
      this.removeFromFavorites(this.userId, propertyId);
    } else {
      this.favouriteProperties.add(propertyId);
      console.log(`Added to favorites: ${propertyId}`);
      this.addToFavorites(this.userId, propertyId);
    }
  }

  // Add to favorites API call
  addToFavorites(userId: string, propertyId: number): void {
    const url = ROUTES.ADD_FAVOURITE; // Replace with your actual endpoint

    const body = { user_id: userId, property_id: propertyId, action:"add" };
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

    const body = { user_id: userId, property_id: propertyId, action:"remove" };
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
    const propertyId = property.id; // Assuming property has an 'id'
    // console.log("sdf",propertyId)
    return this.favouriteProperties.has(propertyId);  // Return true if property is in favorites
  }
  goToPropertyDetails(propertyId: number): void {
    this.router.navigate(['/property'], { state: { propertyId: propertyId } });
  }
}
