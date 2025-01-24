import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GoBackComponent } from '../components/go-back/go-back.component'; // Import GoBackComponent
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here
import { FooterComponent } from '../components/footer/footer.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, GoBackComponent, FormsModule, FooterComponent, CommonModule], // Import IonicModule here
})
export class ProfilePage {
  profileImage: string = 'assets/maleIcon.jpg'; // Default to male image
  phone: string = " ";
  Username: string = "";
  showEmailMessage: string = "";
  gender: string = 'male';
  private _storage: Storage | null = null; // Private storage instance

  constructor(private http: HttpClient, private storage: Storage) { 
    // console.log('Initializing ProfilePage...');
    this.initStorage();
  }

  // Initialize the Ionic Storage
  async initStorage() {
    this._storage = await this.storage.create(); // Create the storage instance
    this.retrieveEmail(); // Retrieve the email after storage is initialized
  }

  // Retrieve email from Ionic Storage
  async retrieveEmail() {
    const storedEmail = await this._storage?.get('email');
    if (storedEmail) {
      // console.log('Email retrieved from Ionic Storage:', storedEmail);
      this.Username = storedEmail; // Assign the retrieved email to Username
    } else {
      // console.log('No email found in Ionic Storage');
      this.Username = 'Default Username'; // Optional: set a default value if no email is found
    }
  }
  async ngOnInit() {
    // console.log('ngOnInit called...');
    await this.retrieveEmail(); // Ensure email is retrieved during component initialization
  }

  setProfileImage() {
    // console.log('Setting profile image based on gender:', this.gender);
    if (this.gender === 'male') {
      this.profileImage = 'assets/maleIcon.jpg';
    } else if (this.gender === 'female') {
      this.profileImage = 'assets/female.jpg';
    } else {
      this.profileImage = 'assets/otherIcon.jpg'; // Default for any other option
    }
    // console.log('Profile image set to:', this.profileImage);
  }

  submitProfile() {
    const profileData = {
      phone: this.phone,
      gender: this.gender,
      profileImage: this.profileImage
    };
    console.log('Submitting profile data:', profileData);

    const apiUrl = ROUTES.UPDATE_PROFILE; // Replace with your actual API URL
    console.log('API URL:', apiUrl);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer 2245', // Add Bearer if it's a token-based authentication
      'Content-Type': 'application/json', // Ensure the content type is set to JSON
    });
    console.log('HTTP headers:', headers);

    this.http.post<any>(apiUrl, profileData, { headers }).subscribe(
      (response) => {
        console.log('Profile saved successfully:', response);
      },
      (error) => {
        console.error('Error saving profile:', error);
      }
    );
  }

  showEmail() {
    console.log('Displaying email:', this.Username);
    this.showEmailMessage = `Email: ${this.Username}`;
    setTimeout(() => {
      console.log('Hiding email message');
      this.showEmailMessage = '';
    }, 3000);  // Hide message after 3 seconds
  }
}
