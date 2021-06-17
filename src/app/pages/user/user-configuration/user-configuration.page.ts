import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { ApiService } from "src/app/services/api/api.service";
import { ToastService } from "src/app/services/toast.service";
import { LoadingController } from "@ionic/angular";
import { UserData } from "src/app/services/storage/user-data";
import { Validations } from "src/app/validators/validations";
import { isUndefined, isNullOrUndefined } from "util";
import { AlertController, NavController } from "@ionic/angular";

@Component({
  selector: "app-user-configuration",
  templateUrl: "./user-configuration.page.html",
  styleUrls: ["./user-configuration.page.scss"],
  providers: [UserData],
})
export class UserConfigurationPage implements OnInit {
  /*   public email_notification: any;
  public push_notification: any;
  public blocked: any; */
  public configurationForm: FormGroup;
  public userId: number;
  public darkTheme: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private userData: UserData,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.buildForm();
    this.setDefaultValues();
  }

  ngOnInit() {  }

  private buildForm() {
    this.configurationForm = this.formBuilder.group({
      email_notification: [""],
      push_notification: [""],
      blocked: [""],
      theme: [""],
    });
  }

  setDefaultValues() {
    this.userData.getTheme().then((val)=>{
      const theme = val;
      console.log("set default user config");
      console.log(theme);
      
      if(!isNullOrUndefined(theme)){
        this.configurationForm.controls.theme.setValue(theme === "dark" ? true : false);
      }
    });
    this.userData.getUser().then((val) => {
      const user = val;
      if (user != null && !isUndefined(user)) {
        this.userId = user.id;
        if (user.blocked == null) {
          user.blocked == false;
        }
        this.configurationForm.controls.email_notification.setValue(
          user.email_notification
        );
        this.configurationForm.controls.push_notification.setValue(
          user.push_notification
        );
        this.configurationForm.controls.blocked.setValue(user.blocked);
      }
    });
  }

  async saveChanges(controlName: string) {
    const value = !this.configurationForm.get(controlName).value;
    let params = null;
    switch (controlName) {
      case "email_notification":
        params = {
          email_notification: value,
        };
        break;

      case "push_notification":
        params = {
          push_notification: value,
        };
        break;
      case "blocked":
        params = {
          blocked: true,
        };
        break;

      default:
        params = null;
        break;
    }

    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    const token = await this.userData.getToken();
    this.api.updateConfig("users/" + this.userId, params, token).subscribe(
      async (res) => {
        this.userData.getUser().then(async (val) => {
          loading.dismiss();
          val = res;
          this.userData.setUser(val);
        });
        if(controlName == "blocked"){
          this.userData.setUser(null);
          this.navCtrl.navigateForward("/");
        }
      },
      async (err) => {
        this.setDefaultValues();
        const error = err.error;
        await loading.dismiss();
        if (error && error.statusCode === 400) {
          await this.toast.openToast("Datos Incorrectos", "danger");
        } else {
          await this.toast.openToast("Error en el servidor", "danger");
        }
      }
    );
  }

  async blockUser() {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: "Te extrañaremos",
      message: "¿Realmente desea eliminar su cuenta?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            //console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Sí",
          handler: () => {
            this.saveChanges("blocked");
          },
        },
      ],
    });

    await alert.present();
  }

  async changeTheme(){
    let isChecked = !this.configurationForm.get("theme").value;
    document.body.classList.toggle('dark', isChecked);
    await this.userData.setTheme(isChecked ? "dark" : "light");
    //
    window.dispatchEvent(new CustomEvent("dark:theme"));
  }
}
