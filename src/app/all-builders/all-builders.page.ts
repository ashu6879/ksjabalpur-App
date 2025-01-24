import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; // Import Location service
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { catchError } from 'rxjs/operators'; // To handle errors
import { of } from 'rxjs'; // To handle fallback values
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-all-builders',
  templateUrl: './all-builders.page.html',
  styleUrls: ['./all-builders.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, FormsModule, CommonModule],
})
export class AllBuildersPage implements OnInit {
  baseUrl = 'http://65.0.7.21/ksjabalpur/';
  buildersData: any[] = []; // Variable to store fetched data
  isLoading: boolean = false; // Loading state
  errorMessage: string = ''; // Error message

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient // Inject HttpClient
  ) {}

  ngOnInit() {
    this.fetchBuilders(); // Call fetch function on init
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}

  goBack() {
    this.location.back(); // Navigate to the previous page
  }

  /**
   * Fetch builders from API
   */
  fetchBuilders() {
    const apiUrl = ROUTES.GET_BUILDERS; // Replace with your actual API endpoint
    const headers = new HttpHeaders({
      Authorization: '2245', // Add the Authorization header if required
    });
  
    this.isLoading = true; // Show loading indicator
    this.http
      .get<any[]>(apiUrl, { headers }) // Use GET request with headers
      .subscribe(
        (data) => {
          // Process each builder's data to include the full image URL
          this.buildersData = data.map(builder => ({
            ...builder,
            BuilderLogo: this.baseUrl + builder.BuilderLogo // Attach the base URL to the image path
          }));
          this.isLoading = false; // Hide loading indicator
        },
        (error) => {
          console.error('Error fetching builders:', error);
          this.errorMessage = 'Failed to fetch builders. Please try again later.';
          this.isLoading = false; // Hide loading indicator even if there's an error
        }
      );
  }
}
