import { Component } from '@angular/core';
import { Location } from '@angular/common'; // Import Location service

@Component({
  selector: 'app-go-back',
  templateUrl: './go-back.component.html',
  styleUrls: ['./go-back.component.scss'],
})
export class GoBackComponent {
  constructor(private location: Location) {} // Inject Location service

  // Navigate back to the previous page
  goBack() {
    this.location.back(); // This will navigate the user to the previous page
  }
}
