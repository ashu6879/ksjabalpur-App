import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import Location service
import { GoBackComponent } from '../components/go-back/go-back.component'; // Import GoBackComponent

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule,GoBackComponent], // Import IonicModule here
})
export class SignupPage  {
  constructor(private router: Router, private location: Location) {} // Inject Location service

  // Navigate to Signup Verification page
  goToSignup() {
    this.router.navigate(['/signup-verification']);
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Navigate back to the previous page
  goBack() {
    this.location.back(); // This will navigate the user to the previous page
  }
}
