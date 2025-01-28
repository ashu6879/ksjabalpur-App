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
  // builderData: any[] = []; // To hold the fetched builder data
  builderData: any[] = []; // Holds the filtered data
  fullData: any[] = [];    // Holds the complete data (before filtering)
  isLoading = false;
  errorMessage = '';
  filteredData: any[] = [];
  categories: string[] = [];
  isFilterModalOpen: boolean = false;
  minPrice: number = 5; // Minimum price value
  maxPrice: number = 1000000; // Maximum price value
  filters = {
    price: { min: this.minPrice, max: this.maxPrice },
    location: '',
    propertyName: ''
  };
  // Selected category and search text for filtering
  selectedCategory: string = '';
  searchText: string = '';

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
      this.builderData = [...this.fullData]; // Show all properties initially
  
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
        this.fullData = responseData.message; // Assuming 'message' contains the property data
        this.builderData = [...this.fullData]; // Show all properties initially
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
  filterData(): void {
    let filteredData = [...this.fullData];  // Start from the full data

    // Apply price filter
    if (this.filters.price) {
      filteredData = filteredData.filter(property =>
        property.current_price >= this.filters.price.min && property.current_price <= this.filters.price.max
      );
    }

    // Apply location filter
    if (this.filters.location) {
      filteredData = filteredData.filter(property =>
        property.city.toLowerCase().includes(this.filters.location.toLowerCase()) ||
        property.property_address.toLowerCase().includes(this.filters.location.toLowerCase())
      );
    }

    // Apply property name filter
    if (this.filters.propertyName) {
      filteredData = filteredData.filter(property =>
        property.property_name.toLowerCase().includes(this.filters.propertyName.toLowerCase())
      );
    }

    // Update builderData with filtered data
    this.builderData = filteredData;
  }
  applyFilter() {
    let filteredData = [...this.fullData]; // Start with the full data
  
    // Function to parse price (e.g., "10 lakh" to 10)
    const parsePrice = (price: string): number => {
      const numericPrice = price.toLowerCase().replace(/[^\d.-]/g, ''); // Remove non-numeric characters
      return parseFloat(numericPrice);
    };
  
    // Apply price range filter if set
    if (this.filters.price) {
      filteredData = filteredData.filter(property => {
        const currentPriceNumeric = parsePrice(property.current_price);
        return currentPriceNumeric >= this.filters.price.min && currentPriceNumeric <= this.filters.price.max;
      });
    }
  
    // Apply location filter if set (city or property_address)
    if (this.filters.location) {
      filteredData = filteredData.filter(property =>
        property.city.toLowerCase().includes(this.filters.location.toLowerCase()) || 
        property.property_address.toLowerCase().includes(this.filters.location.toLowerCase())
      );
    }
  
    // Apply property name filter if set
    if (this.filters.propertyName) {
      filteredData = filteredData.filter(property =>
        property.property_name.toLowerCase().includes(this.filters.propertyName.toLowerCase())
      );
    }
  
    // Update builderData with filtered results
    this.builderData = filteredData;
    this.closeFilterModal(); // Close the filter modal
  }

  // Method to clear all filters and show all data
  clearFilters() {
    // Reset all filter values to default
    this.filters = {
      price: { min: 0, max: 100 },  // Reset price range
      location: '',
      propertyName: ''
    };
  
    // Reset builderData to full data without filters
    this.builderData = [...this.fullData]; // Show all properties again
  }
  
  
    // Toggle Filter Modal
    openFilterModal() {
      this.isFilterModalOpen = true;
    }
  
    closeFilterModal() {
      this.isFilterModalOpen = false;
    }

}
