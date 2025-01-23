import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule], // Import IonicModule here
})
export class WelcomePage {
  constructor(private router: Router) {}

  goToSignup() {
    this.router.navigate(['/signup']); // Navigate to the Signup page
  }
  goToLogin() {
    this.router.navigate(['/login']); // Navigate to the Signup page
  }
}
