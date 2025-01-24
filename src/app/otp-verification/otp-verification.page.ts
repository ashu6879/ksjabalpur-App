import { Component, QueryList, ViewChildren } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router,ActivatedRoute  } from '@angular/router';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
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
    private storage: Storage
  ) {
    this.initStorage();
    // Retrieve email from route parameters (if applicable)
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

    if (input.length === 1 && index < this.otp.length - 1) {
      switch (index) {
        case 0:
          this.otpInput2.nativeElement.focus();
          break;
        case 1:
          this.otpInput3.nativeElement.focus();
          break;
        case 2:
          this.otpInput4.nativeElement.focus();
          break;
      }
    }
  }

  onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      if (this.otp[index] !== '') {
        this.otp[index] = '';
      } else if (index > 0) {
        switch (index) {
          case 1:
            this.otpInput1.nativeElement.focus();
            this.otp[0] = '';
            break;
          case 2:
            this.otpInput2.nativeElement.focus();
            this.otp[1] = '';
            break;
          case 3:
            this.otpInput3.nativeElement.focus();
            this.otp[2] = '';
            break;
        }
      }
    }
  }
  async onSubmit() {
    const enteredOtp = this.otp.join('');
    if (!this.email) {
      console.error('Email is missing. Please handle this error appropriately.');
      return; // Prevent sending the request without email
    }
  
    const loading = await this.loadingController.create({
      message: 'Verifying OTP...',
      spinner: 'circles',
    });
    await loading.present();
  
    try {
      const response = await this.http
        .post(ROUTES.VERIFY_OTP, { otp: enteredOtp, email: this.email })
        .toPromise(); // Use toPromise to work with async/await
  
      console.log('OTP verified successfully:', response);
      await this.storage.set('email', this.email);
      await loading.dismiss();
      this.router.navigate(['/home']); // Navigate to the home page
    } catch (error) {
      console.error('OTP verification failed:', error);
      await loading.dismiss(); // Ensure the loader is dismissed in case of an error
    }
  }
  
}
