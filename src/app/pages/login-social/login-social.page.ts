import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { UserData } from '../../services/storage/user-data';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-login-social',
  templateUrl: './login-social.page.html',
  styleUrls: ['./login-social.page.scss'],
})
export class LoginSocialPage implements OnInit {
  private provider: string;
  constructor(
    private toast: ToastService,
    private router: Router,
    private userData: UserData,
    private api: ApiService,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
  ) {
    this.provider = this.route.snapshot.paramMap.get('provider');
  }

  ngOnInit() {
    this.login();
  }

  async login(){
    const params = new URLSearchParams(location.search);
    const contract = params.get('access_token');
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();
    if ( this.provider === null || this.provider === '' ||  contract === null || contract === ''  ) {
      await this.toast.openToast('Ups, Hubo un error ', 'danger');
      this.router.navigate(['/'], { replaceUrl: true });
      loading.dismiss();
      return;
    }
    this.api.getLoginSocial('auth/' + this.provider + '/callback', { access_token: contract }).subscribe(
      async(res) => {
        await this.userData.login(res.user, res.jwt);
        const homeUrl =
        res.user.role.name === 'Establecimiento'
            ? 'tabs/home-establecimiento'
            : 'tabs/home';
        loading.dismiss();
        this.router.navigate([homeUrl], { replaceUrl: true });
        return;
      },
      async () => {
        await this.toast.openToast('Ups, Hubo un error en el servidor', 'danger');
        loading.dismiss();
        this.router.navigate(['/'], { replaceUrl: true });
        return;
      }
    );
  }

}
