import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule
import { Location } from '@angular/common'; // Import Location service
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule], // Import IonicModule here
})
export class LoginPage {
  email: string = '';

  constructor(
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private loadingController: LoadingController
  ) {}

  // Function to handle sending the OTP request
  async sendOtp() {
    if (!this.email) {
      console.log('Email is required');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Sending OTP...',
      spinner: 'circles',
    });
    await loading.present();

    const params = { email: this.email };
    this.http.post(ROUTES.REQUEST_OTP, params).subscribe(
      (response) => {
        console.log('OTP sent successfully:', response);
        this.router.navigate(['/otp-verification'], {
          queryParams: { email: this.email },
        });
        loading.dismiss();
      },
      (error) => {
        console.error('Error sending OTP:', error);
        loading.dismiss();
      }
    );
  }

  // Navigate to the signup page
  goTosignup() {
    this.router.navigate(['/signup']);
  }

  // Navigate back to the previous page
  goBack() {
    this.location.back();
  }
}
