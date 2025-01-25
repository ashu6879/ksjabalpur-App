import { Component, QueryList, ViewChildren } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class OtpVerificationPage {
  @ViewChild('otpInput1') otpInput1!: ElementRef;
  @ViewChild('otpInput2') otpInput2!: ElementRef;
  @ViewChild('otpInput3') otpInput3!: ElementRef;
  @ViewChild('otpInput4') otpInput4!: ElementRef;

  otp: string[] = ['', '', '', ''];
  email: string = ''; // Assuming email is received from the previous route

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private storage: Storage
  ) {
    this.initStorage();
    // Retrieve email from route parameters
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  async initStorage() {
    await this.storage.create(); // Initialize Ionic Storage
  }

  ngAfterViewInit() {
    // Focus on the first input field after view initialization
    this.otpInput1.nativeElement.focus();
  }

  onInput(event: any, index: number) {
    const input = event.target.value;
    this.otp[index] = input;

    // Move to the next input field if the input is complete
    if (input.length === 1 && index < this.otp.length - 1) {
      const nextInput = [this.otpInput2, this.otpInput3, this.otpInput4][index];
      nextInput.nativeElement.focus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && index > 0 && this.otp[index] === '') {
      const previousInput = [this.otpInput1, this.otpInput2, this.otpInput3][index - 1];
      previousInput.nativeElement.focus();
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // Time in milliseconds the toast will remain
      color, // Toast color: 'danger', 'success', etc.
      position: 'middle', // Display the toast in the center of the screen
      cssClass: 'custom-toast', // Optional: Add a custom CSS class for styling
    });
    await toast.present();
  }

  async onSubmit() {
    const enteredOtp = this.otp.join('');
    if (!this.email) {
      console.error('Email is missing. Please handle this error appropriately.');
      return; // Prevent sending the request without an email
    }

    const loading = await this.loadingController.create({
      message: 'Verifying OTP...',
      spinner: 'circles',
    });
    await loading.present();

    try {
      const response: any = await this.http
        .post(ROUTES.VERIFY_OTP, { otp: enteredOtp, email: this.email })
        .toPromise();

      console.log('OTP verified successfully:', response);

      if (response?.data?.user_id) {
        // Save user_id and email in storage
        await this.storage.set('user_id', response.data.user_id);
        await this.storage.set('email', this.email);
        await this.storage.set('is_logged_in', true);
        this.router.navigate(['/home']); // Navigate to the home page
      } else {
        console.warn('User ID not found in the response.');
        await this.showToast('Invalid response. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);

      // Display specific error message if available
      const errorMessage = 'OTP verification failed. Please try again.';
      await this.showToast(errorMessage);
    } finally {
      await loading.dismiss(); // Ensure the loader is dismissed
    }
  }
}
