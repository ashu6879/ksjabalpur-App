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
            if (favoriteProperty.property_id) {
              this.favoriteProperties.add(favoriteProperty.property_id); // Add each property_id
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
}