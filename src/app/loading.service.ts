import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingController: LoadingController) { }

  async presentLoading(message: string = 'Please wait...'): Promise<void> {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        message,
        spinner: 'crescent'
      });
      await this.loading.present();
    }
  }

  async dismissLoading(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  } 

}
