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
  baseUrl = 'http://65.0.7.21/ksjabalpur/';
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
        // Optionally, check favorite properties or any other action needed
        // this.checkFavoriteProperties(userId);
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

    const propertyId = property.id;

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
    const propertyId = property.id; // Assuming property has an 'id'
    return this.favoriteProperties.has(propertyId);  // Return true if property is in favorites
  }
}
