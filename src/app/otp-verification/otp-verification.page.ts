import { Component, OnInit,QueryList,ViewChildren  } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.page.html',
  styleUrls: ['./otp-verification.page.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule,], // Import IonicModule here
})
export class OtpVerificationPage {
  otp: string[] = ['', '', '', '']; // Array to store OTP digits

  @ViewChildren('otpInput') otpInputs!: QueryList<any>;

  onInput(event: any, index: number) {
    const input = event.target.value;

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
      } else if (index > 0 && this.otp[index] === '') {
        // If the current box is empty and Backspace is pressed, move to the previous box
        this.otpInputs.toArray()[index - 1].setFocus();
      }
    }
  }
}