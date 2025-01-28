import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FooterComponent } from '../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common'; // Import Location service
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-common-property-page',
  templateUrl: './common-property-page.page.html',
  styleUrls: ['./common-property-page.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent,FormsModule,CommonModule],
})
export class CommonPropertyPagePage  implements   OnDestroy {
  userId: string | null = null;
  favoriteProperties: Set<number> = new Set();
  isMenuOpen: boolean = false;
  categoryData: any[] = [];
  categoryName: string = '';
  categoryId: string = '';
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
  fullData: any[] = [];    // Holds the complete data (before filtering)


  constructor(private menuCtrl: MenuController,private route: ActivatedRoute,private location: Location,private router: Router,private storage: Storage,private http: HttpClient) {}

  async ngOnInit() {
    const combinedData = history.state.combinedData; // Access the combined data

    if (combinedData && combinedData.categoryData && combinedData.categoryName && combinedData.categoryId) {
      this.categoryData = combinedData.categoryData;
      this.categoryName = combinedData.categoryName;
      this.categoryId = combinedData.categoryId;

      console.log('Category Name:', this.categoryName);
      console.log('Category ID:', this.categoryId);
      console.log('Received category data:', this.categoryData);
      this.fullData = this.categoryData;
    } else {
      console.log('No combined category data found');
    }
    const userId = await this.storage.get('user_id');
    if (userId) {
      // Optionally, check favorite properties or any other action needed
      this.checkFavoriteProperties(userId);
    } else {
      console.warn('User ID not found in storage.');
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
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
  
    console.log('Initial Data:', this.fullData);  // Log the initial data before filtering
  
    // Apply price filter
    if (this.filters.price) {
      console.log('Applying price filter:', this.filters.price);  // Log the price filter being applied
      filteredData = filteredData.filter(property => {
        const currentPrice = property.current_price;
        console.log(`Checking price for ${property.property_name}: ${currentPrice}`);
        return currentPrice >= this.filters.price.min && currentPrice <= this.filters.price.max;
      });
    }
  
    // Apply location filter
    if (this.filters.location) {
      console.log('Applying location filter:', this.filters.location);  // Log the location filter being applied
      filteredData = filteredData.filter(property => {
        const isInCity = property.city.toLowerCase().includes(this.filters.location.toLowerCase());
        const isInAddress = property.property_address.toLowerCase().includes(this.filters.location.toLowerCase());
        console.log(`Checking location for ${property.property_name} - City: ${isInCity}, Address: ${isInAddress}`);
        return isInCity || isInAddress;
      });
    }
  
    // Apply property name filter
    if (this.filters.propertyName) {
      console.log('Applying property name filter:', this.filters.propertyName);  // Log the property name filter being applied
      filteredData = filteredData.filter(property => {
        const matchesPropertyName = property.property_name.toLowerCase().includes(this.filters.propertyName.toLowerCase());
        console.log(`Checking property name for ${property.property_name}: ${matchesPropertyName}`);
        return matchesPropertyName;
      });
    }
  
    // Log the filtered data after all filters
    console.log('Filtered Data:', filteredData);
  
    // Update builderData with filtered data
    this.categoryData = filteredData;
  }
  applyFilter() {
    let filteredData = [...this.fullData]; // Start with the full data
    console.log("Initial Data:", filteredData);  // Log the full data before filtering
  
    // Function to parse price (e.g., "15 Lakhs" to 15)
    const parsePrice = (price: string): number => {
      const numericPrice = price.toLowerCase().replace(/[^\d.-]/g, ''); // Remove non-numeric characters
      return parseFloat(numericPrice);
    };
  
    // Apply price range filter if set
    if (this.filters.price) {
      console.log('Applying price filter:', this.filters.price);  // Log price filter being applied
      filteredData = filteredData.filter(property => {
        const currentPriceNumeric = parsePrice(property.current_price);
        console.log(`Checking price for ${property.property_name}: ${currentPriceNumeric}`);
        return currentPriceNumeric >= this.filters.price.min && currentPriceNumeric <= this.filters.price.max;
      });
    }
  
    // Apply location filter if set (city or property_address)
    if (this.filters.location) {
      console.log('Applying location filter:', this.filters.location);  // Log location filter being applied
      filteredData = filteredData.filter(property => {
        const isInCity = property.city.toLowerCase().includes(this.filters.location.toLowerCase());
        const isInAddress = property.property_address.toLowerCase().includes(this.filters.location.toLowerCase());
        console.log(`Checking location for ${property.property_name} - City: ${isInCity}, Address: ${isInAddress}`);
        return isInCity || isInAddress;
      });
    }
  
    // Apply property name filter if set
    if (this.filters.propertyName) {
      console.log('Applying property name filter:', this.filters.propertyName);  // Log property name filter being applied
      filteredData = filteredData.filter(property => {
        const trimmedPropertyName = property.property_name.trim().toLowerCase();
        const searchTerm = this.filters.propertyName.trim().toLowerCase();
        const matchesPropertyName = trimmedPropertyName.includes(searchTerm);
        console.log(`Checking property name for ${property.property_name}: ${matchesPropertyName}`);
        return matchesPropertyName;
      });
    }
  
    // Log the filtered data after all filters
    console.log('Filtered Data:', filteredData);
  
    // Update builderData with filtered data
    this.categoryData = filteredData;
    this.closeFilterModal(); // Close the filter modal if applicable
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
    this.categoryData = [...this.fullData]; // Show all properties again
  }
  
  
    // Toggle Filter Modal
    openFilterModal() {
      this.isFilterModalOpen = true;
    }
  
    closeFilterModal() {
      this.isFilterModalOpen = false;
    }
}