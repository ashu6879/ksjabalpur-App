import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../components/footer/footer.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { GoBackComponent } from '../components/go-back/go-back.component';
import { Location } from '@angular/common'; // Import Location service
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Import HttpClient to make API calls
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, GoBackComponent, FooterComponent, CommonModule,FormsModule],
})
export class SearchPage implements OnInit {
  searchPerformed: boolean = false;  // Tracks if a search has been performed
  userId: string | null = null;
  favouriteProperties: Set<number> = new Set();
  searchTerm: string = ''; // To bind to the search input field
  searchResults: any[] = []; // Array to store the search results

  constructor(private route: ActivatedRoute,private location: Location,private router: Router,private http: HttpClient,private storage: Storage) { }

  ngOnInit() {
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
    // Handle search on key press (keyup)
    onSearch(event: any) {
      console.log('Searching for:', this.searchTerm.trim());
    
      if (this.searchTerm.trim() === '') {
        this.searchResults = []; // Clear results if input is empty
        this.searchPerformed = false;  // No search performed yet
        console.log('Search input is empty, clearing results');
        return;
      }
    
      // Mark search as performed
      this.searchPerformed = true;
    
      // Prepare the form-data to send as key-value pairs
      const formData = new FormData();
      formData.append('search_item', this.searchTerm.trim()); // Append the search term as key-value
    
      // Log the form data (just for debugging)
      console.log('Sending search request with form data:', formData);
    
      // Replace with your actual API endpoint
      const url = ROUTES.SEARCH_PROPERTY; // Update to your API endpoint
    
      // Set headers if needed (FormData typically doesn't require a 'Content-Type' header)
      const headers = new HttpHeaders();
    
      // Make a POST request with form-data
      this.http.post<any>(url, formData, { headers }).subscribe(
        (response) => {
          // Assuming response contains a `data` property with the search results
          if (response.success) {
            console.log('Search results received:', response.data);
            this.searchResults = response.data; // Save only the 'data' array
    
            // If no results found, ensure that searchPerformed is true
            if (this.searchResults.length === 0) {
              console.log('No results found');
            }
          } else {
            console.error('Search failed: ', response.message);
            this.searchResults = []; // Clear results if search fails
          }
        },
        (error) => {
          console.error('Error fetching search results:', error);
          this.searchResults = []; // Clear results in case of error
        }
      );
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
    goToPropertyDetails(propertyId: number): void {
      this.router.navigate(['/property'], { state: { propertyId: propertyId } });
    }
    isIconFilled(property: any): boolean {
      const propertyId = property.id; // Assuming property has an 'id'
      // console.log("sdf",propertyId)
      return this.favouriteProperties.has(propertyId);  // Return true if property is in favorites
    }
}
