import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CtrlErrors } from "../../../validators/ctrlErrors";
import { UserData } from "../../../services/storage/user-data";
import { isUndefined } from "util";
import { PollAnswered } from "../../../interfaces/poll/pollAnswered";
import { AnswerPhoto } from "../../../interfaces/poll/answer-photo";
import { Platform } from "@ionic/angular";
import { Question } from "src/app/interfaces/poll/question";
import { AlertController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Institution } from 'src/app/interfaces/institution/institution';
import { Reward } from 'src/app/interfaces/wallet/reward';

@Component({
  selector: "app-question",
  templateUrl: "./dynamic-form-question.component.html",
  styleUrls: ["./dynamic-form-question.component.scss"],
  providers: [UserData],
})
export class DynamicFormQuestionComponent implements OnChanges {
  @Input() question: Question;
  @Input() form: FormGroup;
  @Input() idPoll: string;
  @Input() namePoll: string;
  @Input() questionsNumber: number;
  @Output() getProgressPoll = new EventEmitter();
  @Input() userRole: string;
  @Input() institution: Institution;
  @Input() reward: Reward;
  @Input() config: any;

  public user;
  public answerPhoto: Array<AnswerPhoto>;
  public numberChanges: number;
  public progressPoll: number;
  public progress: number;
  public platformDeploy: string;

  constructor(
    private userData: UserData,
    private platForm: Platform,
    private alertCtrl: AlertController,
    private camera: Camera,
    private webview: WebView,
  ) {
    this.numberChanges = 0;
    this.answerPhoto = [];
    this.checkPlatform();
  }

  ngOnChanges(): void {
    this.numberChanges++;
    //verificacion de usuario en el LocalStorage
    this.userData.getUser().then((val) => {
      this.user = val;
      if (this.user != null) {
        if (this.numberChanges <= 1) {
          this.setDefaultValues();
        }
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

  getError(controlName: string, labelName: string): string {
    const errors = CtrlErrors.processError(this.form, controlName, labelName);
    return errors;
  }

  saveChanges() {
    let pollAnswered: PollAnswered = {
      configId: this.config,
      pollName: this.namePoll,
      pollQuestionsLength: this.questionsNumber,
      questions: [],
      reward: this.reward,
      institution: this.institution
    };

    let totalAnswered = 0;
    let totalQuestions = 0;

    for (const key in this.form.controls) {
      if (this.form.controls.hasOwnProperty(key)) {
        const element = this.form.controls[key];

        if (element.status == "VALID") {
          pollAnswered.questions.push({
            idQuestion: key,
            value: this.form.value[key],
          });
          totalAnswered++;
        }
        totalQuestions++;
      }
    }

    this.userData.setQuestions(pollAnswered);
    if (totalQuestions != 0) {
      this.progressPoll = (totalAnswered / totalQuestions) * 100;
      this.getProgressPoll.emit(this.progressPoll);
    }
  }

  setDefaultValues() {
    this.userData.getQuestions().then((val) => {
      let pollSaved: PollAnswered = val;

      if (pollSaved != null && pollSaved.questions.length > 0) {
        for (let i = 0; i < pollSaved.questions.length; i++) {
          const element = pollSaved.questions[i];
          if (
            !isUndefined(element.value) &&
            element.value != null &&
            element.value != ""
          ) {
            this.form.controls[element.idQuestion].setValue(element.value);
          }
        }
        this.saveChanges();
      }
    });
  }

  async takePhotoQuestion(keyImageFormControl: string) {
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
        imageData = "data:image/jpeg;base64," + imageData;
        imageData = this.webview.convertFileSrc(imageData);
        this.form.controls[keyImageFormControl].setValue(imageData);
        this.saveChanges();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  fileSelected(fileInput: any, keyImageFormControl: string) {
    const reader = new FileReader();
    if (fileInput.target.files && fileInput.target.files.length) {
      const [file] = fileInput.target.files;

      //this.profileForm.controls.imgProfile.setValue(file);
      reader.readAsDataURL(file);
      reader.readAsText;
      reader.onload = () => {
        //this.image = reader.result.toString();
        this.form.controls[keyImageFormControl].setValue(reader.result);
        this.saveChanges();
      };
    }
  }

  async showAlertImage(keyImageformControl) {
    const srcImage = this.form.value[keyImageformControl];
    const alert = await this.alertCtrl.create({
      cssClass: "alert-show-image",
      message: `<img src='${srcImage}' class="img-alert">`,
    });
    await alert.present();
  }

  async deleteImage(keyImageformControl) {
    const srcImage = this.form.value[keyImageformControl];
    const alert = await this.alertCtrl.create({
      header: 'Eliminando imagen',
      message: 'Está seguro de eliminar la imagen',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alertButton',
          handler: () => {
            //console.log('Confirm Cancel');
          }
        }, {
          text: 'Si',
          cssClass: 'alertButton',
          handler: () => {
            this.form.controls[keyImageformControl].setValue(null);
            this.saveChanges();
          }
        }
      ]
    })
    await alert.present();
  }
}
