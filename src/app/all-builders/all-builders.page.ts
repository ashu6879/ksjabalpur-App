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

@Component({
  selector: 'app-all-builders',
  templateUrl: './all-builders.page.html',
  styleUrls: ['./all-builders.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, FormsModule, CommonModule],
})
export class AllBuildersPage implements OnInit {
  baseUrl = 'http://65.0.7.21/ksjabalpur/';
  builderID: string = ''; // Default to an empty string
  builderName: string = ''; // Default to an empty string
  builderData: any[] = []; // To hold the fetched builder data
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const navigationState = history.state;

    if (navigationState) {
      // Extract builderID and builderName from the state
      const { builderID, builderName } = navigationState;

      console.log('Received builder ID:', builderID);
      console.log('Received builder Name:', builderName);

      // Set builderID and builderName
      this.builderID = builderID;
      this.builderName = builderName;

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
}
