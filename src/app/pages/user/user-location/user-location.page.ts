import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  AbstractControl,
} from "@angular/forms";
import { ApiService } from "../../../services/api/api.service";
import { LoadingController } from "@ionic/angular";
import { ToastService } from "../../../services/toast.service";
import { UserData } from "../../../services/storage/user-data";
import { CtrlErrors } from "src/app/validators/ctrlErrors";
import { isUndefined, isNullOrUndefined } from "util";
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: "app-user-location",
  templateUrl: "./user-location.page.html",
  styleUrls: ["./user-location.page.scss"],
  providers: [UserData],
})
export class UserLocationPage implements OnInit {
  public locationForm: FormGroup;
  public userName: string;
  public userId: string;
  public userRole: string;
  public msg: any = { error: false, message: null };
  public provinces: Array<any>;
  public cities: Array<any>;
  public parishes: Array<any>;
  public provinceIsSelected = false;
  public darkTheme: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private userData: UserData,
    private core: CoreService,
  ) {}

  async ngOnInit() {
    this.buildForm();
    this.userData.getUser().then((val) => {
      this.userId = val.id;
      this.userRole = val.role.id;
      if (val.user_extra != null) {
        if (
          val.user_extra.province != null &&
          val.user_extra.city != null &&
          val.user_extra.parish != null &&
          val.user_extra.nomenclature != null &&
          val.user_extra.main_street != null &&
          val.user_extra.side_street != null
        ) {
          this.setDefaultValues();
        } else {
          this.getProvinces().then((resp) => {
            this.provinces = resp;
          });
        }
      }else{
        this.getProvinces().then((resp) => {
          this.provinces = resp;
        });
      }
    });
  }

  async onSubmit() {
    const params = {
      province: this.locationForm.value.province,
      city: this.locationForm.value.city,
      parish: this.locationForm.value.parish,
      nomenclature: this.locationForm.value.nomenclature,
      main_street: this.locationForm.value.main_street,
      side_street: this.locationForm.value.side_street,
      user: this.userId,
    };

    this.msg.error = false;
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    const token = await this.userData.getToken();

    this.api
      .post("user-extras/service", JSON.stringify(params), token)
      .subscribe(
        (res) => {
          this.userData.getUser().then(async (val) => {
            const user = val;
            user.user_extra = res;
            user.user_extra.user = this.userId;
            this.userData.setUser(user);

            loading.dismiss();
            await this.toast.openToast("Actualizado", "success");
          });
        },
        async (err) => {
          const error = err.error;
          await loading.dismiss();
          if (error && error.statusCode === 400) {
            this.msg.error = true;
            this.msg.message = "No se actualizo el perfil";
          } else {
            await this.toast.openToast("Error en el servidor", "danger");
          }
        }
      );
  }

  private buildForm() {
    this.locationForm = this.formBuilder.group({
      province: [""],
      city: [""],
      parish: [""],
      nomenclature: [""],
      main_street: [""],
      side_street: [""],
    });
  }

  async setDefaultValues() {
    const user = await this.userData.getUser();
    this.userRole = user.role.id;
    let idProvince = user.user_extra.province + "";
    let idCity = user.user_extra.city + "";
    let idParish = user.user_extra.parish + "";


    this.getProvinces().then((resp) => {
      this.provinces = resp;

      this.locationForm.controls.province.setValue(idProvince);
    });
    this.getCities(idProvince).then((resp) => {
      this.cities = resp;
      this.locationForm.controls.city.setValue(idCity);
    });
    this.getParishes(idCity).then((resp) => {
      this.parishes = resp;
      this.locationForm.controls.parish.setValue(idParish);
    });

    this.locationForm.controls.nomenclature.setValue(
      user.user_extra.nomenclature
    );
    this.locationForm.controls.main_street.setValue(
      user.user_extra.main_street
    );
    this.locationForm.controls.side_street.setValue(
      user.user_extra.side_street
    );
  }
  
  putCities(idProvince: string) {
    this.locationForm.controls.city.setValue("");
    this.locationForm.controls.parish.setValue("");

    this.getCities(idProvince).then((resp) => {
      this.cities = resp;
    });
  }
  putParishes(idCity: string) {
    if (idCity != "") {
      this.locationForm.controls.parish.setValue("");
      this.getParishes(idCity).then((resp) => {
        this.parishes = resp;
      });
    }
  }

  async getProvinces(): Promise<any> {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    let provinces = null;
    try {
      const token = await this.userData.getToken();
      provinces = await this.api.getAll("provinces", token).toPromise();
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
    }
    return provinces;
  }

  async getCities(idProvince: string): Promise<any> {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    let cities = null;
    try {
      const token = await this.userData.getToken();
      cities = await this.api
        .getAll("cities?province=" + idProvince, token)
        .toPromise();
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
    }
    return cities;
  }

  async getParishes(idCity: string): Promise<any> {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    let parishes = null;
    try {
      const token = await this.userData.getToken();
      parishes = await this.api
        .getAll("parishes?city=" + idCity, token)
        .toPromise();
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
    }
    return parishes;
  }

  // async getProvinces() {
  //   const token = await this.userData.getToken();
  //
  //   this.api.getAll("provinces", token).subscribe(
  //     (resp) => {
  //       this.provinces = resp;
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }
  //
  // async getCities(idProvince: string) {
  //   this.cities = null;
  //   this.parishes = null;
  //
  //   const token = await this.userData.getToken();
  //   this.api.getAll("cities?province=" + idProvince, token).subscribe(
  //     (resp) => {
  //       this.cities = resp;
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }
  //
  // async getParishes(idCity: string) {
  //   this.parishes = null;
  //   const token = await this.userData.getToken();
  //
  //   this.api.getAll("parishes?city=" + idCity, token).subscribe(
  //     (resp) => {
  //       this.parishes = resp;
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  getError(controlName: string, labelName: string): string {
    const errors = CtrlErrors.processError(
      this.locationForm,
      controlName,
      labelName
    );
    return errors;
  }
}
