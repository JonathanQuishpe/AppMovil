import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ApiService } from "../../services/api/api.service";
import { UserData } from "../../services/storage/user-data";
import { ActivatedRoute } from "@angular/router";
import { ToastService } from "src/app/services/toast.service";
import { LoadingController } from "@ionic/angular";
import { isUndefined, isNullOrUndefined } from "util";
import { Institution } from 'src/app/interfaces/poll/configuration/institution';
import { User } from 'src/app/interfaces/user/user';
import { Reward } from 'src/app/interfaces/wallet/reward';
import { Poll } from 'src/app/interfaces/poll/poll';

@Component({
  selector: "app-poll",
  templateUrl: "./poll.page.html",
  styleUrls: ["./poll.page.scss"],
  providers: [UserData],
})
export class PollPage implements OnInit, OnDestroy {
  //public pollSelected: string;
  public configSelected: string;
  public poll: Poll;
  public user: User;
  public userRole: string;
  public institution: Institution;
  public reward: Reward;

  constructor(
    private api: ApiService,
    private userData: UserData,
    private route: ActivatedRoute,
    private toast: ToastService,
    private loadingCtrl: LoadingController
  ) {
    //this.pollSelected = this.route.snapshot.paramMap.get("id");
    
    //Atrapar lo que viene en URL variable config. Hay que cambiar por el unique
    this.configSelected = this.route.snapshot.paramMap.get("config");

    this.userData.getUser().then((val) => {
      this.user = val;   
      if (this.user != null) {
        this.userRole = this.user.role.name;
        this.getPoll();
      } else {
        this.user = null;
        this.getPublicPoll();
      }
    });
  }
  ngOnDestroy(): void {
    if (this.user != null) {      
      window.dispatchEvent(new CustomEvent("progress:poll"));
/*       window.dispatchEvent(new CustomEvent("charge:configuration"));
      window.dispatchEvent(new CustomEvent("charge:wallet")); */
    }
  }

  ngOnInit() {}

  async getPoll() {
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    const token = await this.userData.getToken();
    this.api.getAll("configurations/" + this.configSelected, token).subscribe(
      async (res: any) => {
        this.institution = res.institution;
        this.reward = res.reward;
        this.poll = this.textToArray(res.poll);
        loading.dismiss();
      },
      async (error) => {
        loading.dismiss();
        if (error) {
          await this.toast.openToast(error.message, "danger");
        } else {
          await this.toast.openToast("Error en el servidor", "danger");
        }
      }
    );
  }

  async getPublicPoll() {
    
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    //const token = await this.userData.getToken();
    this.api.getAll("configurations/" + this.configSelected).subscribe(
      async (res: any) => {
        this.poll = this.textToArray(res.poll);
        loading.dismiss();
      },
      async (error) => {
        loading.dismiss();
        if (error) {
          await this.toast.openToast(error.message, "danger");
        } else {
          await this.toast.openToast("Error en el servidor", "danger");
        }
      }
    );
  }

  textToArray(res) {
    for (let i = 0; i < res.question.length; i++) {
      if (
        res.question[i].type == "combo" ||
        res.question[i].type == "checklist" ||
        res.question[i].type == "radioButton" ||
        res.question[i].type == "ranger"
      ) {
        if(!isNullOrUndefined(res.question[i].value)){
          res.question[i].value = res.question[i].value
          .split(",")
          .map((item) => (item = item.trim()));
        }else{
          res.question[i].value = ["Opción no ingresada"]
        }
      }
    }
    return res;
  }
}
