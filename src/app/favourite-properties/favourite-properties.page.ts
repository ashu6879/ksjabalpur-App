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

@Component({
  selector: 'app-favourite-properties',
  templateUrl: './favourite-properties.page.html',
  styleUrls: ['./favourite-properties.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, FormsModule],

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
          this.fetchFavouritebyID(favouriteProperties);
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

  fetchFavouritebyID(favouriteProperties: any[]) {
    const apiUrl = ROUTES.PROPERTY_CAT_BYID;  // replace with your actual API URL
    const allPropertiesDetails: any[] = [];  // This array will store all the property details
    const headers = new HttpHeaders({
      'Authorization': '2245',
      'Content-Type': 'application/json',
    });
  
    // Create an array of Observables for all API calls
    const apiCalls = favouriteProperties.map(favProperty => {
      const propertyId = favProperty.ID;  // Fetch propertyId from favouriteProperties.id
      console.log("Property ID:", propertyId);
      return this.http.post(apiUrl, { property_id: propertyId }, { headers });
    });
  
    // Use forkJoin to wait for all API calls to complete
    forkJoin(apiCalls).subscribe(
      (responses: any[]) => {
        // Process and log all responses
        responses.forEach((response, index) => {
          console.log(`Response for property ID ${favouriteProperties[index].ID}:`, response);
          allPropertiesDetails.push(response);  // Add the response to the combined array
        });
        console.log('Combined property details:', allPropertiesDetails);
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
}
