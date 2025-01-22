import { Component, OnInit,OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';  // Ensure this is imported
import { FormsModule } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],  // Ensure IonicModule is here
})
export class SidebarComponent  implements  OnInit, OnDestroy {
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

