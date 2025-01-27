import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Ensure this is imported
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd  } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Import CommonModule
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,CommonModule],  // Ensure IonicModule is here
})
export class FooterComponent {
  currentRoute: string = '';
  homeImage: string = 'assets/Home.png';
  searchImage: string = 'assets/Search.png';
  favouriteImage: string = 'assets/heart.png';
  accountImage: string = 'assets/Group.png';

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen to route changes and update the currentRoute
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = this.router.url;
        this.updateFooterImages();
      }
    });
  }

  // Update footer images based on the current route
  updateFooterImages() {
    if (this.currentRoute === '/home') {
      this.homeImage = 'assets/homeActive.png';  // Example: Change image for active route
    } else {
      this.homeImage = 'assets/Home.png';  // Default image for Home
    }

    if (this.currentRoute === '/search') {
      this.searchImage = 'assets/searchActive.png';  // Change image for active route
    } else {
      this.searchImage = 'assets/Search.png';  // Default image for Search
    }

    if (this.currentRoute === '/favourite-properties') {
      this.favouriteImage = 'assets/heartActive.png';  // Change image for active route
    } else {
      this.favouriteImage = 'assets/heart.png';  // Default image for Favourite
    }

    if (this.currentRoute === '/profile') {
      this.accountImage = 'assets/userActive.png';  // Change image for active route
    } else {
      this.accountImage = 'assets/Group.png';  // Default image for Account
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToprofile() {
    this.router.navigate(['/profile']);
  }
  goToFav() {
    this.router.navigate(['/favourite-properties']);
  }
}