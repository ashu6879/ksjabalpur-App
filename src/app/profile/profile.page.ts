import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GoBackComponent } from '../components/go-back/go-back.component'; // Import GoBackComponent
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule,GoBackComponent,FormsModule,FooterComponent], // Import IonicModule here
})
export class ProfilePage {

  // Default image to show (this can be changed based on gender selection)
  profileImage: string = 'assets/maleIcon.jpg'; // Default to male image
  firstName: string = 'KSjabalpur';
  lastName: string = 'test';
  email: string = 'test@gmail.com';
  phone: string = "74046590325";
  Username: string = "ksname"
  
  // Gender selection (male or female)
  gender: string = 'male'; // Set initial gender value (can be dynamically set later)

  constructor() { 
    this.setProfileImage();
  }

  // Set the profile image based on the gender selection
  setProfileImage() {
    if (this.gender === 'male') {
      this.profileImage = 'assets/maleIcon.jpg';
    } else {
      this.profileImage = 'assets/femaleIcon.jpg';
    }
  }

  // Handle form submission
  submitProfile() {
    console.log('Profile submitted:', {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      Username: this.Username
    });
  }
}
