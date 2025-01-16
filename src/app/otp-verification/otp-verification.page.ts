import { Component, QueryList, ViewChildren } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class OtpVerificationPage {
  constructor(private router: Router) {} // Inject Location service
  otp: string[] = ['', '', '', '']; // Array to store OTP digits
  @ViewChildren('otpInput') otpInputs!: QueryList<any>;
    // Navigate to Signup Verification page
    goToSignup() {
      this.router.navigate(['/home']);
    }
  onInput(event: any, index: number) {
    const input = event.target.value;

    // Update the OTP array with the current input
    this.otp[index] = input;

    // Move to the next input if there's a value and it's not the last box
    if (input.length === 1 && index < this.otp.length - 1) {
      this.otpInputs.toArray()[index + 1].setFocus();
    }
  }

  onKeydown(event: KeyboardEvent, index: number) {
    // Only handle backspace
    if (event.key === 'Backspace') {
      if (this.otp[index] !== '') {
        // If there's a value, clear it
        this.otp[index] = '';
      } else if (index > 0) {
        // If the current box is empty, move to the previous box
        this.otpInputs.toArray()[index - 1].setFocus();
        this.otp[index - 1] = ''; // Clear the previous box
      }
    }
  }
}
