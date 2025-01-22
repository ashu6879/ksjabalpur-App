import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FooterComponent } from '../components/footer/footer.component';
@Component({
  selector: 'app-commercial-properties',
  templateUrl: './commercial-properties.page.html',
  styleUrls: ['./commercial-properties.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule,FooterComponent],  // Ensure IonicModule is here
})
export class CommercialPropertiesPage  implements   OnDestroy {
  isMenuOpen: boolean = false;

  constructor(private menuCtrl: MenuController) {}

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
}