import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import Location service
@Component({
  selector: 'app-signup-verification',
  templateUrl: './signup-verification.page.html',
  styleUrls: ['./signup-verification.page.scss'],
  standalone: true,
  imports: [IonicModule], // Import IonicModule here
})
export class SignupVerificationPage{
  constructor(private router: Router, private location: Location) {} // Inject Location service

  // Navigate to Signup Verification page
  goToSignup() {
    this.router.navigate(['/otp-verification']);
  }

  // Navigate back to the previous page
  goBack() {
    this.location.back(); // This will navigate the user to the previous page
  }
}
