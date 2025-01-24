import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular'; // Assuming you're using Ionic Storage

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private storage: Storage) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    
    // Initialize the storage if it hasn't been initialized yet
    await this.storage.create();

    const isLoggedIn = await this.storage.get('is_logged_in'); // Get session status

    if (isLoggedIn) {
      return true; // Allow access if logged in
    } else {
      // Redirect to login page if not logged in
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
