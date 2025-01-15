import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonicModule], // Import IonicModule here
})
export class WelcomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
