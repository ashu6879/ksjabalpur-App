import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule], // Import IonicModule here
})
export class SplashPage implements OnInit {
  constructor(private router: Router, private storage: Storage) {
    this.initStorage();
  }
  private _storage: Storage | null = null; // Private storage instance
  async initStorage() {
    this._storage = await this.storage.create(); // Create the storage instance
  }
  async ngOnInit() {
    // Initialize storage
    await this.storage.create();

    setTimeout(async () => {
      const isLoggedIn = await this.storage.get('is_logged_in'); // Get session status
      const email = localStorage.getItem('email'); // Correct key here
      const user_id = await this._storage?.get('user_id');
      console.log("hii",isLoggedIn,email,user_id)
      if (isLoggedIn && email && user_id) {
        // Navigate to home page if all conditions are met
        this.router.navigateByUrl('/home');
      } else {
        // Navigate to welcome page otherwise
        this.router.navigateByUrl('/welcome');
      }
    }, 3000); // 3 seconds
  }
}
