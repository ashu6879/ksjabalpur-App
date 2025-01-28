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
import { forkJoin } from 'rxjs';  // import forkJoin
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favourite-properties',
  templateUrl: './favourite-properties.page.html',
  styleUrls: ['./favourite-properties.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, FormsModule,CommonModule],

})
export class FavouritePropertiesPage implements OnInit {
  favoriteProperties: Set<number> = new Set();
  userId: string | null = null;

  constructor(private route: ActivatedRoute,private location: Location,private router: Router,private storage: Storage,private http: HttpClient) { }

  async ngOnInit() {
    await this.storage.create();
    this.userId = await this.storage.get('user_id');
    if (this.userId) {
      console.log("user_id", this.userId);
      this.fetchFavouriteProperties(this.userId);  // Call fetchFavouriteProperties after getting userId
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

  fetchFavouriteProperties(userId: string) {
    const apiUrl = ROUTES.CHECK_FAVOURITE;  // replace with your actual API URL
    const body = { user_id: userId };
    const headers = new HttpHeaders({
      'Authorization': '2245',
      'Content-Type': 'application/json',
    });

    this.http.post(apiUrl, body,{ headers }).subscribe(
      (response: any) => {
        if (response && Array.isArray(response.message)) {
          const favouriteProperties = response.message;  // Extract the array of favorite properties
          // this.fetchFavouritebyID(favouriteProperties);
          console.log('Favourite properties:', favouriteProperties);
          // You can now work with the `favouriteProperties` array
        } else {
          console.warn('No favourite properties found or invalid response format');
        }
      },
      (error) => {
        console.error('Error fetching favourite properties:', error);
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

    const propertyId = 22;

    if (this.favoriteProperties.has(propertyId)) {
      this.favoriteProperties.delete(propertyId);
      console.log(`Removed from favorites: ${propertyId}`);
      // this.removeFromFavorites(this.userId, propertyId);
    } else {
      this.favoriteProperties.add(propertyId);
      console.log(`Added to favorites: ${propertyId}`);
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
    const propertyId = 22; // Assuming property has an 'id'
    return this.favoriteProperties.has(propertyId);  // Return true if property is in favorites
  }
  goToPropertyDetails(propertyId: number): void {
    this.router.navigate(['/property'], { state: { propertyId: propertyId } });
  }
}
