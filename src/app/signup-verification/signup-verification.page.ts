import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; // Import Location service
import { LoadingController } from '@ionic/angular'
import { HttpClient } from '@angular/common/http';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here

@Component({
  selector: 'app-signup-verification',
  templateUrl: './signup-verification.page.html',
  styleUrls: ['./signup-verification.page.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule], // Import IonicModule here
})
export class SignupVerificationPage{
  email: string = '';

  constructor(private router: Router, private location: Location,private http: HttpClient,private loadingController: LoadingController) {} // Inject Location service
    // Function to handle sending the OTP request
    async sendOtp() {
      const loading = await this.loadingController.create({
        message: 'Sending OTP...',
        spinner: 'circles'
      });
      await loading.present();
      if (!this.email) {
        console.log('Email is required');
        return;
      }
    
      const params = { email: this.email };
      this.http.post(ROUTES.REQUEST_OTP, params).subscribe(
        (response) => {
          console.log('OTP sent successfully:', response);
          this.router.navigate(['/otp-verification'], { queryParams: { email: this.email } }); 
          loading.dismiss();
        },
        (error) => {
          console.error('Error sending OTP:', error);
          loading.dismiss();
        }
      );
    }
  // Navigate to Signup Verification page
  goToSignup() {
    this.router.navigate(['/otp-verification']);
  }

  // Navigate back to the previous page
  goBack() {
    this.location.back(); // This will navigate the user to the previous page
  }
}
