import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule], // Import IonicModule here
})
export class SignupPage  {
  constructor(private router: Router) {}

  goToSignup() {
    this.router.navigate(['/signup']); // Navigate to the Signup page
  }
}
