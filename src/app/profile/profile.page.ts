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
import { Router  } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, GoBackComponent, FormsModule, FooterComponent, CommonModule], // Import IonicModule here
})
export class ProfilePage {
  profileImage: string ="assets/maleIcon.jpg";
  phone: string = '123-456-7890'; // Existing value for Phone
  Email: string = "";
  User_id: string = "";
  Username: string = 'JohnDoe'; // Existing value for Username
  showEmailMessage: string = "";
  gender: string = '0'; // Default value set to '0' (Male)
  private _storage: Storage | null = null; // Private storage instance

  constructor(private http: HttpClient, private storage: Storage,private alertController: AlertController,private router: Router,) { 
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
    const user_id = await this._storage?.get('user_id');
    if (storedEmail && user_id) {
      // console.log('Email retrieved from Ionic Storage:', storedEmail);
      console.log('user_id retrieved from Ionic Storage:', user_id);
      this.Email = storedEmail; // Assign the retrieved email to Username
      this.User_id = user_id;
    } else {
      // console.log('No email found in Ionic Storage');
      this.Email = 'Default Email'; // Optional: set a default value if no email is found
    }
  }
  // async ngOnInit() {
  //   // console.log('ngOnInit called...');
  //   await this.retrieveEmail(); // Ensure email is retrieved during component initialization
  // }

  setProfileImage() {
    // Map the string gender value to the corresponding profile image
    if (this.gender === '0') {
      this.profileImage = 'assets/maleIcon.jpg';
    } else if (this.gender === '1') {
      this.profileImage = 'assets/female.jpg';
    } else {
      this.profileImage = 'assets/otherIcon.jpg'; // Default for any other option
    }
    console.log('Profile image set to:', this.profileImage);
  }

  submitProfile() {
    const profileData = {
      user_id:this.User_id,
      phone: this.phone,
      username:this.Username,
      gender:this.gender
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
      },
      (error) => {
        console.error('Error saving profile:', error);
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

  // Reset the placeholder text if the input is empty after losing focus
  resetPlaceholder(field: string) {
    if (field === 'Username' && this.Username.trim() === "") {
      this.Username = "Enter Username"; // Reset Username placeholder text
    }
    if (field === 'Phone' && this.phone.trim() === "") {
      this.phone = "Enter Phone Number"; // Reset Phone placeholder text
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
