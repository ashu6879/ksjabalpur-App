import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import Location service
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed

@Component({
  selector: 'app-show-all-common-properties',
  templateUrl: './show-all-common-properties.page.html',
  styleUrls: ['./show-all-common-properties.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent,FormsModule,CommonModule],
})
export class ShowAllCommonPropertiesPage implements OnInit {
  favouriteProperties: Set<number> = new Set();
  userId: string | null = null;
  propertyData: any;
  noFavouriteProperties: boolean = false;

  constructor(private location: Location,private router: Router,private storage: Storage,private http: HttpClient) { }

  async ngOnInit() {
    // Access the passed data using the Router's state property
    const navigationState = this.router.getCurrentNavigation()?.extras.state;

    if (navigationState && navigationState['propertyData']) {
      this.propertyData = navigationState['propertyData']; // Store builderData
      console.log('Received data:', this.propertyData); // Use the data
    } else {
      console.error('No data found');
    }
    await this.storage.create();
    this.userId = await this.storage.get('user_id');
    if (this.userId) {
      console.log("user_id", this.userId);
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
  goBack() {
    this.location.back(); // This will navigate the user to the previous page
  }
  goToPropertyDetails(propertyId: number): void {
    this.router.navigate(['/property'], { state: { propertyId: propertyId } });
  }
    // Toggle favorite property
    async toggleIcon(event: Event, property: any): Promise<void> {
      event.stopPropagation();
      this.userId = await this.storage.get('user_id');
      if (!this.userId) {
        console.error('User ID not found in storage.');
        return;
      }
  
      const propertyId = property.property_id;
  
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
      const propertyId = property.property_id; // Assuming property has an 'id'
      // console.log("sdf",propertyId)
      return this.favouriteProperties.has(propertyId);  // Return true if property is in favorites
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

}
