import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Validations } from "../../../validators/validations";
import { UserData } from "src/app/services/storage/user-data";
import { isUndefined, isNull, isNullOrUndefined } from "util";
import { PollAnswered } from "../../../interfaces/poll/pollAnswered";
import { Question } from "src/app/interfaces/poll/question";
import { ApiService } from "src/app/services/api/api.service";
import {
  LoadingController,
  AlertController,
  NavController,
} from "@ionic/angular";
import { ToastService } from "src/app/services/toast.service";
import { CoreService } from "src/app/services/core.service";
import { Institution } from 'src/app/interfaces/poll/configuration/institution';
import { Reward } from 'src/app/interfaces/wallet/reward';

@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
  providers: [UserData, ApiService, CoreService],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() poll: any;
  @Input() config: any;
  @Input() userRole: string;
  @Input() institution: Institution;
  @Input() reward: Reward;
  form: FormGroup;
  public results: string = "";
  public progressPoll: number = 0;
  public user;
  public tokenReward: string;
  public load: HTMLIonLoadingElement = null;
  public isLoading: boolean;
  public sizeForm: number;

  constructor(
    private userData: UserData,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private toast: ToastService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private core: CoreService
  ) {}

  ngOnChanges(): void {}

  ngOnInit() {
    //this.userRole = 3;
    console.log(this.userRole);
    
    if (this.userRole == "Supervisor") {
      console.log("entro");
      
      this.form = this.toFormGroupSupervisor(this.poll.question);
    } else {
      console.log("noentro");
      this.form = this.toFormGroup(this.poll.question);
    }
    //Solo se carga el proceso que ha tenido cuando un usuario esta en el local storage
    this.userData.getUser().then((val) => {
      this.user = val;
      if (this.user != null) {
        this.getProgressPoll();
      }
    });
  }

  getProgressPoll() {
    let totalQuestions = this.poll.question.length;
    this.userData.getQuestions().then((val) => {
      let pollSaved: PollAnswered = val;
      if (pollSaved != null && !isUndefined(pollSaved)) {
        let totalAnswered = pollSaved.questions.length;
        this.progressPoll = Math.trunc((totalAnswered / totalQuestions) * 100);
      }
    });
  }

  toFormGroup(questions: Question[]) {
    let group: any = {};
    questions.forEach((question) => {
      group[question.id] = question.required
        ? new FormControl(null, Validators.required)
        : new FormControl(null);

      if (question.type == "checklist") {
        let formArrayChecklist = [];
        for (let i = 0; i < question.value.length; i++) {
          formArrayChecklist.push(new FormControl(null));
        }
        group[question.id] = question.required
          ? new FormArray(formArrayChecklist, [
              Validations.minSelectedCheckboxes(1),
            ])
          : new FormArray(formArrayChecklist);
      }
    });
    return new FormGroup(group);
  }

  toFormGroupSupervisor(questions: Question[]) {
    let group: any = {};
    this.sizeForm = 0;
    console.log(questions);
    
    questions.forEach((question) => {
      group[question.id] = question.required
        ? new FormControl(null, Validators.required)
        : new FormControl(null);
      this.sizeForm++;

      if (question.image) {
        group[question.id + "img"] = question.required
          ? new FormControl(null, Validators.required)
          : new FormControl(null);
        this.sizeForm++;
      }

      if (question.type == "checklist") {
        let formArrayChecklist = [];
        for (let i = 0; i < question.value.length; i++) {
          formArrayChecklist.push(new FormControl(null));
        }
        group[question.id] = question.required
          ? new FormArray(formArrayChecklist, [
              Validations.minSelectedCheckboxes(1),
            ])
          : new FormArray(formArrayChecklist);
      }
    });
    console.log(group);
    return new FormGroup(group);
  }

  async onSubmit() {
    if (this.user != null) {
      this.sendPoll();
    } else {
      if(this.reward.cost == 0){
        this.sendPublicPoll();
      }else{
        this.alertPublicPollSave();
      }
    }
  }

  async alertPublicPollSave() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Recibe tu recompensa directo en tu correo",
      inputs: [
        {
          name: "email",
          type: "email",
          id: "email",
          value: "",
          placeholder: "Ingrese su correo",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
          },
        },
        {
          text: "Enviar encuesta",
          handler: async (alertData) => {
            this.sendPublicPoll(alertData["email"]);
          },
        },
      ],
    });
    await alert.present();
  }

  async sendPublicPoll(mail?: string) {
    const formAnswered = this.form.getRawValue();
    let answers = this.formatAnswers(formAnswered);
    let mailUser;
    if(!mail){
      mailUser = 'anonimo@boosas.com'
    }else{
      mailUser = mail;
    }

    let pollComplete = {
      configuration: this.config,
      email: mailUser,
      answers: answers,
    };
    

    const loading = await this.loadingCtrl.create({
      message: "Cargando...",
    });

    await loading.present();
    this.api.post("results", pollComplete).subscribe(
      async (resp) => {
        loading.dismiss();
        await this.toast.openToast(resp.message, "success");
        this.userData.setQuestions(null);
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

  getImagenType(dataURI: string) {
    let type = "";
    if (dataURI != null || dataURI != "" || isUndefined(dataURI)) {
      let auxSubs = dataURI.substring(0, 20);
      if (auxSubs.indexOf("image/png") >= 0) {
        type = "png";
      }
      if (auxSubs.indexOf("image/jpeg") >= 0) {
        type = "jpeg";
      }
    }
    return type;
  }

  async sendPoll() {
    const formAnswered = this.form.getRawValue();
    let answers = this.formatAnswers(formAnswered);

    let answersNoImages: Array<{ question_id: string; answer: any }> = [];
    let answersWithImages: Array<{
      question_id: string;
      answer: any;
      image: string;
    }> = [];

    answers.forEach((val) => {
      if (val.image == "" || isNullOrUndefined(val.image)) {
        answersNoImages.push({
          question_id: val.question_id,
          answer: val.answer,
        });
      } else {
        answersWithImages.push(val);
      }
    });
    let paramsToSendNoImage = {
      configuration: this.config,
      email: this.user.email,
      user: this.user.id,
      answers: answersNoImages,
    };
    this.isLoading = true;
    const loading = await this.loadingCtrl
      .create({
        message: "Cargando...",
        spinner: "bubbles",
      })
      .then((load: HTMLIonLoadingElement) => {
        this.load = load;
        this.load.present().then(() => {
          if (!this.isLoading) {
            this.load.dismiss().then();
          }
        });
      });
    const token = await this.userData.getToken();
    this.api.post("results", paramsToSendNoImage, token).subscribe(
      async (res) => {
        //res devuelve un mensaje de la api en la cual indica si la encuesta ya a sido guardada o si se guard[o correctamente]
        if (res.err == true) {
          await this.toast.openToast(res.message, "danger");
          this.load.dismiss();
          this.navCtrl.navigateForward("tabs/home");
          this.userData.setQuestions(null);
        } else {

          //En el caso que no haya problemas se procede a guardar las preguntas con imágenes
          this.load.message = "Respuestas guardadas";
          if (answersWithImages) {
            let hasErrorWhenChargeImagen = await this.saveImage(
              answersWithImages
            );

            if (!hasErrorWhenChargeImagen) {
              this.userData.setQuestions(null);
              await this.toast.openToast("Encuesta guardada", "success");
              if(res.data.reward.cost == 0){
                this.navCtrl.navigateForward(
                  `home/billetera/recompensa/${res.data.reward.cost}`
                );
              }else{
                this.navCtrl.navigateForward(
                  `home/billetera/recompensa/${res.data.unique}`
                );
              }
              
            } else {
              await this.toast.openToast(
                "No se pudieron guardar las imágenes",
                "warning"
              );
              this.navCtrl.navigateForward("tabs/home");
            }
          }
          
          window.dispatchEvent(new CustomEvent("charge:configuration"));
          window.dispatchEvent(new CustomEvent("charge:wallet"));
          await this.load.dismiss();
          this.userData.setQuestions(null);
        }
      },
      async (err) => {
        const error = err.error;
        //await loading.dismiss();
        if (error && error.statusCode === 400) {
          await this.toast.openToast("Datos Incorrectos", "danger");
        } else {
          await this.toast.openToast("Error en el servidor", "danger");
        }
        this.load.dismiss();
        this.userData.setQuestions(null);
        this.navCtrl.navigateForward("tabs/home");
      }
    );
  }

  async saveImage(
    answersWithImages: Array<{
      question_id: string;
      answer: any;
      image: string;
    }>
  ): Promise<any> {
    let hasError = false;
    const token = await this.userData.getToken();
    if (answersWithImages) {
      await this.asyncForEach(answersWithImages, async (val, index) => {
        const formData = new FormData();
        let paramsToSendResultsWithImage = {
          configuration: this.config,
          email: this.user.email,
          user: this.user.id,
          answer: val.answer,
          question_id: val.question_id,
        };

        if (val.image != "") {
          const typeImg = this.getImagenType(val.image);
          const imageName = val.question_id + "answer." + typeImg;
          const imageFile = this.core.dataURLtoFile(val.image, imageName);
          formData.append("files.image", imageFile, imageFile.name);
        }

        formData.append("data", JSON.stringify(paramsToSendResultsWithImage));
        let responseImage = null;
        try {
          responseImage = await this.api
            .post("results", formData, token, "multipart/form-data")
            .toPromise();
          if (responseImage) {
            this.load.message = `Cargando imagen ${index + 1}/${
              answersWithImages.length
            }`;
          } else {
            this.load.message = `No se pudo cargar imagen ${index + 1}/${
              answersWithImages.length
            }`;
            hasError = true;
          }
        } catch (error) {
          this.load.message = `No se pudo cargar imagen ${index + 1}/${
            answersWithImages.length
          }`;
          hasError = true;
        }
      });
      return hasError;
    }
  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  formatAnswers(formAnswered) {
    let answers: Array<{
      question_id: string;
      answer: any;
      image: string;
    }> = [];

    for (const key in formAnswered) {
      if (Object.prototype.hasOwnProperty.call(formAnswered, key)) {
        let question: Question = this.poll.question.filter(
          (q) => q.id == key
        )[0]; // Tomo la posicion 0 porque filtra una sola fila del array question en el objeto poll

        if (question) {
          if (formAnswered[key] != null || formAnswered[key] != "") {
            if (question.type == "combo" || question.type == "radioButton") {
              answers.push({
                question_id: key,
                answer: question.value[formAnswered[key]], //originalmente se almacena el indice de la opcion, para sacar el valor de la respuesta ocupamos ese indice almacenado
                image: question.image ? formAnswered[key + "img"] : "",
              });
            }

            if (question.type == "checklist") {
              /* formAnswered[key].forEach((element) => {
                answers.push({
                  question_id: key,
                  answer: isNull(element) || element == false ? "0" : "1",
                  image: question.image ? formAnswered[key + "img"] : "",
                });
                console.log(answers);
              }); */
              /*                console.log(
                question.value.filter(
                  (opt, index) => (opt == formAnswered[key][index])
                )
              ); */

              let optionsChecked = question.value.filter(
                (opt, index) => (opt = formAnswered[key][index])
              );
              if (optionsChecked.length != 0) {
                optionsChecked.forEach((option) => {
                  answers.push({
                    question_id: key,
                    answer: option,
                    image: question.image ? formAnswered[key + "img"] : "",
                  });
                });
              } else {
                answers.push({
                  question_id: key,
                  answer: "",
                  image: question.image ? formAnswered[key + "img"] : "",
                });
              }
            }
            console.log(question.type);
            
            if (
              question.type == "ranger" ||
              question.type == "shortText" ||
              question.type == "longText" ||
              question.type == "date" ||
              question.type == "hour" ||
              question.type == "number"
            ) {
              answers.push({
                question_id: key,
                answer: formAnswered[key]+"",
                image: question.image ? formAnswered[key + "img"] : "",
              });
            }
          } else {
            answers.push({
              question_id: key,
              answer: "", //originalmente se almacena el indice de la opcion, para sacar el valor de la respuesta ocupamos ese indice almacenado
              image: question.image ? formAnswered[key + "img"] : "",
            });
          }
        }
      }
    }   
    console.log(answers);
     
    return answers;
  }

  changeColorProgressBar() {
    let valueProgress = this.progressPoll / 100;
    switch (valueProgress) {
      case 1:
        return "success";
        break;
      case 0:
        return "danger";
        break;
      default:
        return "warning";
        break;
    }
  }

  receiveProgressPoll(event) {
    this.progressPoll = Math.trunc(event);
  }
}
