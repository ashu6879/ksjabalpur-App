import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed

interface Property {
  id: string;
  property_name: string;
  land_category: string;
  current_price: string;
  previous_price: string;
}

interface Builder {
  id: string;
  builder_name: string;
  builderData: Property[]; // Explicitly define builderData as an array of Property
}

@Component({
  selector: 'app-all-builders',
  templateUrl: './all-builders.page.html',
  styleUrls: ['./all-builders.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent, FormsModule, CommonModule],
})
export class AllBuildersPage implements OnInit {
  baseUrl = 'http://65.0.7.21/ksjabalpur/';
  combinedData?: Builder; // Optional type
  noPropertiesFound = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const navigationState = history.state;

    if (navigationState) {
      this.combinedData = navigationState.combinedData;
      // this.noPropertiesFound = navigationState.noPropertiesFound;

      console.log('Received combined data:', this.combinedData);
      // console.log('No properties found:', this.noPropertiesFound);

      if (this.combinedData?.builderData?.length) {
        this.combinedData.builderData.forEach((property) => {
          console.log('Property Details:', property);
        });
      } else {
        console.error('No builder data found');
        this.errorMessage = 'No builder data available';
      }
    } else {
      console.error('No navigation state found');
      this.errorMessage = 'Navigation state is missing';
    }
  }

  goBack(): void {
    this.location.back(); // Navigate to the previous page
  }
}
