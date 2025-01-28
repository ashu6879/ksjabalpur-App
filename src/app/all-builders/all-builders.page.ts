import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-all-builders',
  templateUrl: './all-builders.page.html',
  styleUrls: ['./all-builders.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, FormsModule, CommonModule],
})
export class AllBuildersPage implements OnInit {
  userId: string | null = null;
  favoriteProperties: Set<number> = new Set();
  baseUrl = 'https://vibrantlivingblog.com/ksjabalpur/';
  builderID: string = ''; // Default to an empty string
  builderName: string = ''; // Default to an empty string
  builderData: any[] = []; // To hold the fetched builder data
  isLoading = false;
  errorMessage = '';

  constructor(
    private storage: Storage,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient
  ) {}
  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      location.reload();
    }, 2000);
  }
  async ngOnInit(): Promise<void> {
    const navigationState = history.state;
  
    if (navigationState) {
      // Extract builderID and builderName from the state
      const { builderID, builderName } = navigationState;
  
      console.log('Received builder ID:', builderID);
      console.log('Received builder Name:', builderName);
  
      // Set builderID and builderName
      this.builderID = builderID;
      this.builderName = builderName;
  
      // Fetch the user_id from Ionic Storage
      const userId = await this.storage.get('user_id');
      if (userId) {
        console.log("user",userId)
        // Optionally, check favorite properties or any other action needed
        this.checkFavoriteProperties(userId);
      } else {
        console.warn('User ID not found in storage.');
      }
  
      // Fetch builder data
      this.fetchBuilderData(this.builderID);
  
    } else {
      console.error('No navigation state found');
      this.errorMessage = 'Navigation state is missing';
    }
  }
  // Fetch builder data using the builderID
  fetchBuilderData(builderID: string): void {
    this.isLoading = true; // Start loading
    const apiUrl = ROUTES.BUILDER_BYID; // Replace with actual API URL
    const headers = new HttpHeaders({
      'Authorization': '2245', // Replace with your actual Authorization token if needed
    });

    const body = {
      builder_id: builderID, // Send builderId as part of the body
    };

    this.http.post<any>(apiUrl, body, { headers }).subscribe({
      next: (responseData) => {
        console.log('Fetched builder data:', responseData);
        this.builderData = responseData.message; // Assuming 'message' contains the property data
        this.isLoading = false; // Stop loading
      },
      error: (error) => {
        console.error('Error fetching builder data:', error);
        this.errorMessage = 'Error fetching builder data';
        this.isLoading = false; // Stop loading
      }
    });
  }

  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
  goToPropertyDetails(propertyId: number): void {
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
    const userId = await this.storage.get('user_id');
    console.log("hello",userId);
    if (!userId) {
      console.error('User ID not found in storage2.');
      return;
    }

    const propertyId = property.id;
    console.log("property id is",propertyId);
    if (this.favoriteProperties.has(propertyId)) {
      this.favoriteProperties.delete(propertyId);
      console.log(`Removed from favorites: ${propertyId}`);
      this.removeFromFavorites(userId, propertyId);
    } else {
      this.favoriteProperties.add(propertyId);
      console.log(`Added to favorites: ${propertyId}`);
      this.addToFavorites(userId, propertyId);
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
    const propertyId = property.id; // Assuming property has an 'id'
    return this.favoriteProperties.has(propertyId);  // Return true if property is in favorites
  }
}
