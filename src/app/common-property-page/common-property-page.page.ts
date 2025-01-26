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
  constructor(private menuCtrl: MenuController,private route: ActivatedRoute,private location: Location,private router: Router,private storage: Storage,) {}

  async ngOnInit() {
    const combinedData = history.state.combinedData; // Access the combined data

    if (combinedData && combinedData.categoryData && combinedData.categoryName && combinedData.categoryId) {
      this.categoryData = combinedData.categoryData;
      this.categoryName = combinedData.categoryName;
      this.categoryId = combinedData.categoryId;

      console.log('Category Name:', this.categoryName);
      console.log('Category ID:', this.categoryId);
      console.log('Received category data:', this.categoryData);
    } else {
      console.log('No combined category data found');
    }
    const userId = await this.storage.get('user_id');
    if (userId) {
      // Optionally, check favorite properties or any other action needed
      // this.checkFavoriteProperties(userId);
    } else {
      console.warn('User ID not found in storage.');
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }
  goBack() {
    this.location.back(); // This will navigate the user to the previous page
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