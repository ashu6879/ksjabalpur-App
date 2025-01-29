interface ProfileResponse {
  status: boolean;
  data: Array<{
    ID: string;
    username: string;
    email: string;
    phone: string;
    gender: string;
  }>;
}
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GoBackComponent } from '../components/go-back/go-back.component'; // Import GoBackComponent
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule here
import { FooterComponent } from '../components/footer/footer.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ROUTES } from '../config/api.config'; // Adjust the import path as needed
import { CommonModule } from '@angular/common';  // Import CommonModule
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, GoBackComponent, FormsModule, FooterComponent, CommonModule], // Import IonicModule here
})
export class ProfilePage {
  profileImage: string = "assets/emptyIcon.png";
  phone: string = ' '; // Default value for Phone
  Email: string = "";
  User_id: string = "";
  Username: string = ' '; // Default value for Username
  showEmailMessage: string = "";
  gender: string = '3'; // Default value set to '0' (Male)
  private _storage: Storage | null = null; // Private storage instance

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private storage: Storage,
    private alertController: AlertController,
    private router: Router
  ) {
    this.initStorage();
  }

  // Initialize the Ionic Storage
  async initStorage() {
    this._storage = await this.storage.create(); // Create the storage instance
    this.retrieveEmailAndUserId(); // Retrieve data after storage is initialized
  }

  // Retrieve email and user_id from Ionic Storage
  async retrieveEmailAndUserId() {
    try {
      const storedEmail = await this._storage?.get('email');
      const user_id = await this._storage?.get('user_id');
      
      console.log('Stored email:', storedEmail);
      console.log('Stored user_id:', user_id);
      
      if (storedEmail && user_id) {
        this.Email = storedEmail;
        this.User_id = user_id;
        console.log('user_id retrieved from Ionic Storage:', this.User_id);
        
        const apiUrl = ROUTES.PROFILE_DETAILS; 
        const headers = new HttpHeaders({
          Authorization: '2245', // Authorization header
          'Content-Type': 'application/json',
        });

        const body = {
          user_id: this.User_id,
        };

        console.log('Sending profile update data:', body);

        // Make the POST request with user_id in the body
        this.http.post<ProfileResponse>(apiUrl, body, { headers }).subscribe(
          (response) => {
            console.log('Profile data response:', response);

            const data = response.data[0]; // Now TypeScript knows response has 'data'

            // For Username
            this.Username = data.username ? data.username : 'Enter Username';

            // For Phone
            this.phone = data.phone ? data.phone : 'Enter Phone Number';

            // For Gender
            this.gender = data.gender ? data.gender : '3';  // Use the placeholder if no data

            // Dynamically set the profile image based on the gender
            this.setProfileImage();

            console.log('Username:', this.Username);
            console.log('Phone:', this.phone);
            console.log('Gender:', this.gender);
          },
          (error) => {
            console.error('Failed to retrieve profile:', error);
          }
        );
      } else {
        console.log('No email or user_id found in Ionic Storage');
        this.Email = 'Default Email'; // Optional: set a default value if no email is found
      }
    } catch (error) {
      console.error('Error retrieving email and user_id from Ionic Storage:', error);
    }
  }
  
  setProfileImage() {
    // Dynamically map the gender value to the corresponding profile image
    if (this.gender === '0') {
        this.profileImage = 'assets/maleIcon.jpg';  // Male image
    } else if (this.gender === '1') {
        this.profileImage = 'assets/female.jpg';  // Female image
    } else if (this.gender === '3') {
        this.profileImage = 'assets/emptyIcon.png';  // Default empty image
    }
    console.log('Profile image set to:', this.profileImage);
}
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // Time in milliseconds the toast will remain
      color, // Toast color: 'danger', 'success', etc.
      position: 'bottom', // Display the toast in the center of the screen
      cssClass: 'custom-toast', // Optional: Add a custom CSS class for styling
    });
    await toast.present();
  }

  async submitProfile() {
    const profileData = {
      user_id: this.User_id,
      phone: this.phone,
      username: this.Username,
      gender: this.gender
    };
    console.log('Submitting profile data:', profileData);

    const apiUrl = ROUTES.UPDATE_PROFILE; // Replace with your actual API URL
    console.log('API URL:', apiUrl);

    const headers = new HttpHeaders({
      'Authorization': '2245', // Add Bearer if it's a token-based authentication
      'Content-Type': 'application/json', // Ensure the content type is set to JSON
    });
    console.log('HTTP headers:', headers);

    this.http.post<any>(apiUrl, profileData, { headers }).subscribe(
      (response) => {
        console.log('Profile saved successfully:', response);
        const errorMessage = 'Profile updated successfully!';
        this.showToast(errorMessage);
      },
      (error) => {
        console.error('Error saving profile:', error);
        alert('There was an error updating your profile. Please try again.');
      }
    );
  }

  showEmail() {
    console.log('Displaying email:', this.Email);
    this.showEmailMessage = `Email: ${this.Email}`;
    setTimeout(() => {
      console.log('Hiding email message');
      this.showEmailMessage = '';
    }, 3000);  // Hide message after 3 seconds
  }

  // Clear the placeholder text when the user focuses on the input
  clearPlaceholder(field: string) {
    if (field === 'Username' && this.Username === "Enter Username") {
      this.Username = ""; // Clear the Username placeholder text
    }
    if (field === 'Phone' && this.phone === "Enter Phone Number") {
      this.phone = ""; // Clear the Phone placeholder text
    }
  }

  resetPlaceholder(field: string) {
    if (field === 'Username' && this.Username.trim() === "") {
      this.Username = "Enter Username"; // Reset Username placeholder text
    }
    if (field === 'Phone' && this.phone.trim() === "") {
      this.phone = "Enter Phone Number"; // Reset Phone placeholder text
    }
    if (field === 'Gender' && (this.gender === "" || this.gender === "Select Gender")) {
      this.gender = "Select Gender"; // Reset Gender placeholder text
    }
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Logout canceled');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    await this.storage.remove('user_id'); // Remove user_id from session storage
    await this.storage.remove('email'); // Remove email from session storage
    await this.storage.remove('is_logged_in'); // Remove session status
    console.log('User logged out successfully.');
  
    // Redirect to the login page
    this.router.navigate(['/login']);
    console.log('Logged out');
  }
}
