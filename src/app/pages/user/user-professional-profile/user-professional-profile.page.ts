import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from "@angular/forms";

import { ApiService } from "../../../services/api/api.service";
import { LoadingController } from "@ionic/angular";
import { ToastService } from "../../../services/toast.service";
import { Router } from "@angular/router";
import { UserData } from "../../../services/storage/user-data";
import { Validations } from "../../../validators/validations";
import { CtrlErrors } from "../../../validators/ctrlErrors";
import { isUndefined, isNullOrUndefined } from "util";
import { CoreService } from "src/app/services/core.service";

@Component({
  selector: "app-user-professional-profile",
  templateUrl: "./user-professional-profile.page.html",
  styleUrls: ["./user-professional-profile.page.scss"],
  providers: [UserData],
})
export class UserProfessionalProfilePage implements OnInit {
  public professionalProfileForm: FormGroup;
  public msg: any = { error: false, message: null };
  public userName: string;
  public userRole: string;
  public userId: number;
  public occupations: Array<any>;
  public professions: Array<any>;
  public studies: Array<any>;
  public darkTheme: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    //private router: Router,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private userData: UserData,
    private core: CoreService
  ) {}

  async ngOnInit() {

    this.buildForm();

    this.userData.getUser().then((val) => {
      this.userId = val.id;
      this.userRole = val.role.id;

      if (val.user_extra != null) {
        if (
          val.user_extra.profession == null ||
          val.user_extra.occupation == null ||
          val.user_extra.study == null
        ) {
          this.getProfessions().then((resp) => {
            this.professions = resp;
          });
          this.getStudies().then((resp) => {
            this.studies = resp;
          });
        } else {
          this.setDefaultValues();
        }
      } else {
        this.getProfessions().then((resp) => {
          this.professions = resp;
        });
        this.getStudies().then((resp) => {
          this.studies = resp;
        });
      }
    });
  }

  private buildForm() {
    this.professionalProfileForm = this.formBuilder.group({
      profession: [""],
      occupation: [""],
      study: [""],
    });
  }

  async onSubmit() {
    const params = {
      occupation: this.professionalProfileForm.value.occupation,
      profession: this.professionalProfileForm.value.profession,
      study: this.professionalProfileForm.value.study,
      user: this.userId,
    };

    this.msg.error = false;
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    const token = await this.userData.getToken();

    this.api.post("user-extras/service", params, token).subscribe(
      async (res) => {
        this.userData.getUser().then(async (val) => {
          val.user_extra = res;
          val.user_extra.user = this.userId;

          this.userData.setUser(val);

          loading.dismiss();
          await this.toast.openToast("Actualizado", "success");
        });
      },
      async (err) => {
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

  async setDefaultValues() {
    const user = await this.userData.getUser();
    this.userRole = user.role.id;
    //Cargando async Profesiones
    this.getProfessions().then((resp) => {
      this.professions = resp; //Guardo el valor en el array de profesiones
      this.professionalProfileForm.controls.profession.setValue(
        //Seteo el valor seleccionado
        user.user_extra.profession + ""
      );
      this.putOccupations(user.user_extra.profession + ""); //Cargo el Array de ocupaciones
      this.professionalProfileForm.controls.occupation.setValue(
        // seteo el valor seleccionado
        user.user_extra.occupation + ""
      );
    });
    //Cargando async Estudios
    this.getStudies().then((resp) => {
      this.studies = resp; //Guardo el valor en el array de estudios
      this.professionalProfileForm.controls.study.setValue(
        // seteo el valor seleccionado
        user.user_extra.study + ""
      );
    });
  }

  async getProfessions(): Promise<any> {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    let professions = null;
    try {
      const token = await this.userData.getToken();
      professions = await this.api.getAll("professions", token).toPromise();
      await loading.dismiss();
    } catch (error) {
      console.log(error);
      await loading.dismiss();
    }
    return professions;
  }

  async getStudies(): Promise<any> {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    let studies = null;
    try {
      const token = await this.userData.getToken();
      studies = await this.api.getAll("studies", token).toPromise();
      await loading.dismiss();
    } catch (error) {
      console.log(error);
      await loading.dismiss();
    }
    return studies;
  }

  putOccupations(professionSelected: string) {
    this.professionalProfileForm.controls.occupation.setValue("");
    let professions = this.professions;
    for (const key in professions) {
      if (professions.hasOwnProperty(key)) {
        if (professions[key].id == professionSelected) {
          this.occupations = professions[key].occupations;
          break;
        }
      }
    }
  }

  getError(controlName: string, labelName: string): string {
    const errors = CtrlErrors.processError(
      this.professionalProfileForm,
      controlName,
      labelName
    );
    return errors;
  }
}
