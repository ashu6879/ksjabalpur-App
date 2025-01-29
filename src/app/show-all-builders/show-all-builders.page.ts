import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../components/footer/footer.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import Location service

@Component({
  selector: 'app-show-all-builders',
  templateUrl: './show-all-builders.page.html',
  styleUrls: ['./show-all-builders.page.scss'],
  standalone: true,
  imports: [IonicModule, FooterComponent,FormsModule,CommonModule],
})
export class ShowAllBuildersPage implements OnInit {
  builderData: any;

  constructor(private router: Router,private location: Location) { }

  ngOnInit() {
    // Access the passed data using the Router's state property
    const navigationState = this.router.getCurrentNavigation()?.extras.state;

    if (navigationState && navigationState['builderData']) { // Use bracket notation here
      this.builderData = navigationState['builderData']; // Store builderData
      console.log('Received builder data:', this.builderData); // Use the data
    } else {
      console.error('No builder data found');
    }
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
  goToBuilder(builder: { id: string; name: string }) {
    if (builder && builder.id) {
      //console.log('Category clicked:', builder.id);
      //console.log('Category Name:', builder.name);
  
      // Proceed with navigation, passing builder id and name as state
      this.router.navigate([`/all-builders/`], {
        state: {
          builderID: builder.id,
          builderName: builder.name
        },
      }).then(() => {
        //console.log('Navigation successful to category page');
      }).catch((err) => {
        console.error('Navigation error:', err);
      });
    } else {
      console.error('Invalid category object:', builder);
    }
  }

}
