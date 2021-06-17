import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastCtrl: ToastController,
  ) { }

  async openToast(message: string, type: string) {
    const toast = await this.toastCtrl.create({
      message: `${message}`,
      duration: 5000,
      keyboardClose: true,
      buttons: [{
          text: 'Cerrar',
          role: 'cancel',
          handler: () => {
          }
        }
      ],
      cssClass: `toast-${type}`
    });

    await toast.present();
  }
}
