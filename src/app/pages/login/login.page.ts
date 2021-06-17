import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Login } from '../../interfaces/login';
import { ApiService } from '../../services/api/api.service';
import { LoadingController, NavController } from '@ionic/angular';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { UserData } from '../../services/storage/user-data';
import { MenuController } from '@ionic/angular';
import { isNullOrUndefined } from 'util';
import { CoreService } from '../../services/core.service';
import { User } from 'src/app/interfaces/user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: [UserData, CoreService],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public user: User;
  public msg: any = { error: false, message: null };
  public uriLogo: string;
  public darkTheme: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private userData: UserData,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private core: CoreService
  ) {
    this.uriLogo = this.core.getLogo();
    this.buildForm();
  }

  async ngOnInit() {
    let isDarkThemeSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.uriLogo = isDarkThemeSystem
      ? this.core.getLogoContrast()
      : this.core.getLogo();
  }

  async login() {
    const formData = new FormData();
    formData.append('identifier', this.loginForm.value.identifier);
    formData.append('password', this.loginForm.value.password);

    this.msg.error = false;
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();
    this.api.post('auth/local', formData).subscribe(
      async (res) => {
        this.userData.login(res.user, res.jwt);
        this.user = res.user;
        /*   const token = await this.userData.getToken();
        if(res.user_extra != null){
          this.api.getAll('user-extras/' + res.id, token).subscribe(
            async (res: any) => {
              this.userData.getUser().then(async (val) => {
                val.user_extra = res;
                console.log('Login con user extra');
                console.log(val);
                val.user_extra.user = res.id;
                this.userData.setUser(val);
                loading.dismiss();
                await this.toast.openToast('Actualizado', 'success');
              });
            },
            async (error) => {
              loading.dismiss();
              if (error) {
                await this.toast.openToast(error.message, 'danger');
              } else {
                await this.toast.openToast('Error en el servidor', 'danger');
              }
            }
          );
        } */

        setTimeout(() => {
          let homeUrl =
            this.user.role.name === 'Establecimiento'
              ? 'tabs/home-establecimiento'
              : 'tabs/home';
          this.router.navigate([homeUrl], { replaceUrl: true });
          loading.dismiss();
          /* this.navCtrl.navigateForward(
            this.user.role.name === 'Establecimiento'
              ? 'tabs/home-establecimiento'
              : 'tabs/home'
          ); */
        }, 800);
      },
      async (err) => {
        const error = err.error;
        await loading.dismiss();
        if (error && error.statusCode === 400) {
          this.msg.error = true;
          if (
            error.message[0].messages[0].message ==
            'Your account has been blocked by an administrator'
          ) {
            this.msg.message = 'Este usuario está dado de baja';
          } else {
            this.msg.message = 'Credenciales incorrectas';
          }
        } else {
          await this.toast.openToast('Error en el servidor', 'danger');
        }
      }
    );
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get emailField() {
    return this.loginForm.get('identifier');
  }

  get passField() {
    return this.loginForm.get('password');
  }

  async loginFacebook(){
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();
    window.location.href = 'https://staging-dot-booapp.uc.r.appspot.com/connect/facebook';
    //this.router.navigateByUrl('https://staging-dot-booapp.uc.r.appspot.com/connect/facebook');
  }
}
