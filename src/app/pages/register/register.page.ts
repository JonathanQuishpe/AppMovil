import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingController } from '@ionic/angular';
import { UserData } from '../../services/storage/user-data';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [
    UserData
  ]
})
export class RegisterPage implements OnInit {
  public registerForm: FormGroup;
  public uriLogo: string;
  public msg: any = { error: false, message: null};
  public darkTheme: boolean;
  public errorMessages = {
    user: [
      {type: 'required', message: 'El campo usuario es requerido'},
      {type: 'milenght', message: 'La longitud del campo usuario debe ser mayor o igual a 6 caracteres'},
      {type: 'maxlenght', message: 'La longitud del campo usuario debe ser inferior o igual a 25 caracteres.'},
      {type: 'pattern', message: 'Please enter a valid User address.'}
    ],
    email: [
      {type: 'required', message: 'El campo email es requerido'},
      {type: 'pattern', message: 'Por favor, introduce una dirección de correo electrónico válida.'}
    ],
    password: [
      {type: 'required', message: 'El campo contraseña es requerido'},
      {type: 'milenght', message: 'La longitud de la contraseña debe ser mayor o igual a 6 caracteres'},
      {type: 'maxlenght', message: 'La longitud de la contraseña debe ser inferior o igual a 30 caracteres.'},
      {type: 'pattern', message: 'La contraseña debe contener números, mayúsculas y minúsculas.'}
    ],
    confirmpassword: [
      {type: 'required', message: 'El campo contraseña es requerido'},
      {type: 'pattern', message: 'La contraseña debe contener números, mayúsculas y minúsculas.'}
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private userData: UserData,
    private router: Router,
    private core: CoreService,
  ) {
    this.buildform();
    
   }

  async ngOnInit() {
    let isDarkThemeSystem = window.matchMedia("(prefers-color-scheme: dark)")
    .matches;

    this.uriLogo = isDarkThemeSystem ?  this.core.getLogoContrast() : this.core.getLogo();
  }

  buildform(){
    this.registerForm = this.formBuilder.group({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirmpassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
      ,
      user: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.pattern('^^[a-z0-9_-]{8,15}$')
      ]))
    }, {
      validators: this.password.bind(this)
    });
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirmpassword');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  async register(){
    const formData = new FormData();
    formData.append('username', this.registerForm.value.user);
    formData.append('email', this.registerForm.value.email);
    formData.append('password', this.registerForm.value.password);
    this.msg.error = false;
    const loading = await this.loadingCtrl.create({ message: 'Cargando...' });
    await loading.present();
    this.api.post('auth/local/register', formData)
    .subscribe(
      async res => {
        this.userData.login(res.user, res.jwt);
        setTimeout(() => {
          loading.dismiss();
          this.router.navigate(["tabs/home"], {replaceUrl:true});
          //this.router.navigateByUrl('tabs/home');
        }, 800);
      },
      async err => {
        const error = err.error;
        await loading.dismiss();
        if ( error && error.statusCode === 400 ) {
          const errorData = error.data[0].messages[0];
          if (errorData.id.split('.')[3] == 'username'){
            this.registerForm.get('user').setErrors({pattern: 'error'});
            await this.toast.openToast('El usuario ya existe', 'danger');
          }
          if (errorData.id.split('.')[3] == 'email'){
            this.registerForm.get('email').setErrors({pattern: 'error'});
            await this.toast.openToast('El correo ya existe', 'danger');
          }
        }else{
          await this.toast.openToast('Error en el servidor', 'danger');
        }
      });
  }


}
