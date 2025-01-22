import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Ensure this is imported
import { FormsModule } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { IonicSlides } from '@ionic/angular';
import { FooterComponent } from '../components/footer/footer.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component'; // Import FooterComponent
import { Router } from '@angular/router';


register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,FooterComponent,SidebarComponent],  // Ensure IonicModule is here
})
export class HomePage implements OnInit, OnDestroy {
  isMenuOpen: boolean = false;
  swiperModules = [IonicSlides];

  constructor(private router: Router, private menuCtrl: MenuController) {}

  ngOnInit() {
    this.menuCtrl.isOpen().then((isOpen) => {
      this.isMenuOpen = isOpen;
    });
  }

  ngAfterViewInit() {
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  handleOutsideClick(event: MouseEvent) {
    const menuElement = document.querySelector('ion-menu');
    const isClickInsideMenu = menuElement?.contains(event.target as Node);

    if (!isClickInsideMenu && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  openMenu() {
    this.menuCtrl.open('mainMenu').then(() => {
      this.isMenuOpen = true;
    });
  }

  closeMenu() {
    this.menuCtrl.close('mainMenu').then(() => {
      this.isMenuOpen = false;
    });
  }
  goToSignup() {
    this.router.navigate(['/commercial-properties']);
  }
}
