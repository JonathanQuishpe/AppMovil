import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
  AbstractControl,
} from "@angular/forms";
import { ApiService } from "../../../services/api/api.service";
import { LoadingController, NavController } from "@ionic/angular";
import { ToastService } from "../../../services/toast.service";
import { UserData } from "../../../services/storage/user-data";
import { CtrlErrors } from "src/app/validators/ctrlErrors";
import { isUndefined, isNullOrUndefined } from "util";
import { Institution } from "src/app/interfaces/institution/institution";
import { User } from "src/app/interfaces/user/user";

@Component({
  selector: "app-user-company",
  templateUrl: "./user-company.page.html",
  styleUrls: ["./user-company.page.scss"],
  providers: [UserData],
})
export class UserCompanyPage implements OnInit {
  public userInstitutions: Institution[];
  public automaticClose = true;
  public userInstitutionsComplete: Institution[];
  public user: User;

  constructor(
    private userData: UserData,
    private loadingCtrl: LoadingController,
    private api: ApiService,
    private navCtrl: NavController,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    /* Check User*/
    this.user = await this.userData.getUser();
    if (this.user) {
      this.userInstitutions = this.user.institutions;
      this.getBranchOffices();
    } else {
      await this.toast.openToast(
        "Usuario no encontrado, ingrese nuevamente",
        "danger"
      );
      this.navCtrl.navigateForward("/");
    }
  }

  toggleSection(index) {
    this.userInstitutionsComplete[index].open = !this.userInstitutionsComplete[
      index
    ].open;

    if (this.automaticClose && this.userInstitutionsComplete[index].open) {
      this.userInstitutionsComplete
        .filter((item, itemIndex) => itemIndex != index)
        .map((item) => (item.open = false));
    }
  }

  async getBranchOffices() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();

    this.userInstitutionsComplete = [];

    for await (const institution of this.userInstitutions) {
      const branch: any = await this.api
        .getAll("institutions/" + institution.id, token)
        .toPromise()
        .catch();

      if (branch) {
        this.userInstitutionsComplete.push(branch);
      }
    }
    loading.dismiss();
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  onErrorImg(img) {
    try {
      if (img.url) {
        return img.url;
      } else {
        return "../../../assets/img/temp_empresa.png";
      }
    } catch (error) {
      return "../../../assets/img/temp_empresa.png";
    }
  }

  numberOfBranchOffice(branchOffice): string {
    try {
      if (branchOffice.length === 0) return "Sin sucursal";
      if (branchOffice.length === 1) return "1 Sucursal";
      if (branchOffice.length > 1)
        return branchOffice.length + " Sucursales";
    } catch (error) {}
    return "Sin sucursal";
  }
}
