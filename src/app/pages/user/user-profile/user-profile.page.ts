import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { Login } from "src/app/interfaces/login";
import { Validations } from "../../../validators/validations";
import { CtrlErrors } from "../../../validators/ctrlErrors";
import { CoreService } from "../../../services/core.service";
import { isUndefined, isNumber, isNullOrUndefined } from "util";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Platform } from "@ionic/angular";
//import { async } from "@angular/core/testing";
//import { type } from 'os';
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.page.html",
  styleUrls: ["./user-profile.page.scss"],
  providers: [UserData, CoreService],
})
export class UserProfilePage implements OnInit, OnDestroy {
  public profileForm: FormGroup;
  public profile: Login;
  public msg: any = { error: false, message: null };
  public maxDate = new Date().toISOString();
  public userName: string;
  public userRole: string;
  public userId: number;
  public genders: Array<any>;
  public languages: Array<any>;
  public maritalStatuses: Array<any>;
  public random: string;
  public image: string;
  public platformDeploy: string;
  public imgToUpload: Array<File>;
  public imageCharged: string;
  public darkTheme: boolean;
  public email: string;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private userData: UserData,
    private core: CoreService,
    private camera: Camera,
    private webview: WebView,
    private platForm: Platform
  ) {
    this.image = "";
  }
  ngOnDestroy(): void {
    window.dispatchEvent(new CustomEvent("img:change"));
  }

  async ngOnInit() {
    this.chargeAvatar();
    this.checkPlatform();
    this.buildForm();
    this.setDefaultValues();
    this.getGender();
    this.getLanguages();
    this.getMaritalStatus();
  }

  chargeAvatar() {
    this.core.avatarProfile().then((resp) => {
      if (this.image == "") {
        this.image = resp;
      }
    });
  }

  checkPlatform() {
    this.platformDeploy = "browser";
    if (this.platForm.is("ios")) {
      this.platformDeploy = "ios";
    }
    if (this.platForm.is("android")) {
      this.platformDeploy = "android";
    }
  }

  private buildForm() {
    this.profileForm = this.formBuilder.group({
      imgProfile: [""],
      first_name: ["", [Validators.minLength(3)]],
      last_name: ["", [Validators.minLength(3)]],
      cellphone: new FormControl("", [
        Validations.validateNumber,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      birthdate: [""],
      gender: [""],
      languages: [""],
      maritalStatus: [""],
      document: new FormControl("", [Validations.validateDocument]),
    });
  }

  getImagenType(dataURI: string) {
    let type = "";
    if (dataURI != null || dataURI != "" || isUndefined(dataURI)) {
      const auxSubs = dataURI.substring(0, 20);
      if (auxSubs.indexOf("image/png")) {
        type = "png";
      }
      if (auxSubs.indexOf("image/jpeg")) {
        type = "jpeg";
      }
    }
    return type;
  }

  async onSubmit() {
    let params = {
      first_name: this.profileForm.value.first_name,
      last_name: this.profileForm.value.last_name,
      cellphone: this.profileForm.value.cellphone,
      birthdate: this.profileForm.value.birthdate,
      document: this.profileForm.value.document,
      languages: this.profileForm.value.languages,
      marital_status: this.profileForm.value.maritalStatus,
      gender: this.profileForm.value.gender,
      user: this.userId,
    };

    console.log(this.profileForm.value.languages);

    if (!this.profileForm.value.first_name) delete params.first_name;
    if (!this.profileForm.value.last_name) delete params.last_name;
    if (!this.profileForm.value.cellphone) delete params.cellphone;
    if (!this.profileForm.value.birthdate) delete params.birthdate;
    if (!this.profileForm.value.document) delete params.document;
    if (!this.profileForm.value.languages) delete params.languages;
    if (!this.profileForm.value.maritalStatus) delete params.marital_status;
    if (!this.profileForm.value.gender) delete params.gender;

    console.log(params);

    this.msg.error = false;
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    const token = await this.userData.getToken();

    const formData = new FormData();
    if (this.profileForm.value.imgProfile) {
      const typeImg = this.getImagenType(this.profileForm.value.imgProfile);
      const imageName = this.userId + "." + typeImg;
      const imageFile = this.core.dataURLtoFile(
        this.profileForm.value.imgProfile,
        imageName
      );

      formData.append("files.image", imageFile, imageFile.name);
    }
    formData.append("data", JSON.stringify(params));
    this.imageCharged = "cargando";
    this.api
      .post("user-extras/service", formData, token, "multipart/form-data")
      .subscribe(
        async (responseImage) => {
          this.userData.getUser().then(async (val) => {
            val.user_extra = responseImage;
            val.user_extra.user = this.userId;
            this.userData.setUser(val);
            this.imageCharged = "";
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
          this.chargeAvatar();
        }
      );
  }

  async getGender() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    this.api.getAll("genders", token).subscribe(
      (resp) => {
        this.genders = resp;
        loading.dismiss();
      },
      (err) => {
        loading.dismiss();
      }
    );
  }

  async getMaritalStatus() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();

    this.api.getAll("marital-statuses", token).subscribe(
      (resp) => {
        this.maritalStatuses = resp;

        loading.dismiss();
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  async getLanguages() {
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();

    this.api.getAll("languages", token).subscribe(
      (resp) => {
        this.languages = resp;
        loading.dismiss();
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  setDefaultValues() {
    this.userData.getUser().then((val) => {
      this.userName = val.username;
      this.userId = val.id;
      this.userRole = val.role.id;
      this.email = val.email;
      console.log(val);

      if (val.user_extra) {
        /*  if (
          val.user_extra.last_name != null &&
          val.user_extra.first_name != null &&
          val.user_extra.document != null &&
          val.user_extra.gender != null &&
          val.user_extra.language != null &&
          val.user_extra.marital_status != null &&
          val.user_extra.birthdate != null &&
          val.user_extra.cellphone != null
        ) { */
        //let size = val.user_extra.image.length;
        /*       try {
            if (
              isNumber(val.user_extra.image) ||
              isNullOrUndefined(val.user_extra.image)
            ) {
              this.chargeAvatar();
            } else {
              this.image = val.user_extra.image.url;
            }
          } catch (error) {
            this.chargeAvatar();
          } */

        /* console.log(typeof(val.user_extra.image)); */

        if (val.user_extra.image) {
          if (typeof val.user_extra.image != "number") {
            this.image = val.user_extra.image.url;
          }
        } else {
          this.chargeAvatar();
        }

        this.profileForm.controls.first_name.setValue(
          val.user_extra.first_name ? val.user_extra.first_name : null
        );
        this.profileForm.controls.last_name.setValue(
          val.user_extra.last_name ? val.user_extra.last_name : null
        );
        this.profileForm.controls.cellphone.setValue(
          val.user_extra.cellphone ? val.user_extra.cellphone : null
        );
        this.profileForm.controls.birthdate.setValue(
          val.user_extra.birthdate ? val.user_extra.birthdate : null
        );
        this.profileForm.controls.document.setValue(
          val.user_extra.document ? val.user_extra.document : null
        );
        this.profileForm.controls.gender.setValue(
          val.user_extra.gender ? val.user_extra.gender + "" : null
        );
        this.profileForm.controls.maritalStatus.setValue(
          val.user_extra.marital_status
            ? val.user_extra.marital_status + ""
            : null
        );

        /* this.profileForm.controls.languages.setValue(
          val.user_extra.languages ? val.user_extra.languages[0] + "" : null
        ); */
        if (val.user_extra.languages) {
          let langs = [];
          val.user_extra.languages.forEach((element) => {
            langs.push(element+"");
          });
          this.profileForm.controls.languages.setValue(
            langs
          );
        }

        /* if (val.user_extra.languages) {
          val.user_extra.languages.map((lang) => {
            lang = lang;
          });
          console.log(val.user_extra.languages);
          this.profileForm.controls.languages.setValue(
            val.user_extra.languages
          );
        } */
      }
      // }
    });
  }

  getError(controlName: string, labelName: string): string {
    const errors = CtrlErrors.processError(
      this.profileForm,
      controlName,
      labelName
    );
    return errors;
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      cameraDirection: this.camera.Direction.FRONT,
      correctOrientation: true,
    };
    this.camera
      .getPicture(options)
      .then((imageData) => {
        /*   imageData =
          this.platForm.is("ios") || this.platForm.is("android")
            ? imageData
            : "data:image/jpeg;base64," + imageData; */
        imageData = "data:image/jpeg;base64," + imageData;
        imageData = this.webview.convertFileSrc(imageData);
        this.image = imageData;
        this.profileForm.patchValue({
          imgProfile: this.image,
        });
        //console.log(this.profileForm.value.imgProfile);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fileSelected(fileInput: any) {
    const reader = new FileReader();
    if (fileInput.target.files && fileInput.target.files.length) {
      const [file] = fileInput.target.files;

      //this.profileForm.controls.imgProfile.setValue(file);
      reader.readAsDataURL(file);
      reader.readAsText;
      reader.onload = () => {
        this.image = reader.result.toString();
        this.profileForm.patchValue({
          imgProfile: reader.result,
        });
        //console.log(this.profileForm);

        // need to run CD since file load runs outside of zone
        //this.cd.markForCheck();
      };
    }
  }
}
