import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Ensure this is imported
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],  // Ensure IonicModule is here
})
export class FooterComponent {
  constructor(private router: Router) {}

  goToprofile() {
    this.router.navigate(['/profile']); // Navigate to the Signup page
  }
  goToHome() {
    this.router.navigate(['/home']); // Navigate to the Signup page
  }
}