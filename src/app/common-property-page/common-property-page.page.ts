import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FooterComponent } from '../components/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common'; // Import Location service
import { Router } from '@angular/router';


@Component({
  selector: 'app-common-property-page',
  templateUrl: './common-property-page.page.html',
  styleUrls: ['./common-property-page.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent,FormsModule,CommonModule],
})
export class CommonPropertyPagePage  implements   OnDestroy {
  isMenuOpen: boolean = false;
  categoryData: any[] = [];
  categoryName: string = '';
  categoryId: string = '';
  constructor(private menuCtrl: MenuController,private route: ActivatedRoute,private location: Location,private router: Router,) {}

  ngOnInit() {
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
}