import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { InstitutionResults } from 'src/app/interfaces/institution/institutionResults';
import { ApiService } from 'src/app/services/api/api.service';
import { UserData } from 'src/app/services/storage/user-data';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-summary-statistics',
  templateUrl: './summary-statistics.page.html',
  styleUrls: ['./summary-statistics.page.scss'],
})
export class SummaryStatisticsPage implements OnInit {

  public configId: string;
  public configurationInfo: InstitutionResults;
  public labelsConfigurationInfo: Array<any>;
  public configName: string;
  constructor(
    private api: ApiService,
    private userData: UserData,
    private route: ActivatedRoute,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
  ) {
    this.configId = this.route.snapshot.paramMap.get("configId");
  }

  ngOnInit() {
    this.getStatisticsInformation();
  }

  async getStatisticsInformation(){
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    this.api.getAll("/configurations/institution/" + this.configId, token).subscribe(
      (res: any) => {
        //this.configurationInfo = res;
        //console.log(this.statisticsList);
        this.configurationInfo = res;
        if(this.configurationInfo){
          this.configName = this.configurationInfo.name;
          this.labelsConfigurationInfo = [{
            label: "Establecimiento",
            content: this.configurationInfo.institution.name,
          },{
            label: "Encuesta",
            content: this.configurationInfo.poll.name,
          }
          ,{
            label: "Recompensa",
            content: this.configurationInfo.reward.name,
          },/* {
            label: "Audiencia",
            content: "Ejemplo "
          } */]
        }
        loading.dismiss();
        
      },
      async (error) => {
        loading.dismiss();
        console.log(error);
        
      }
    );
  }

  goToStatistics(){
    this.navCtrl.navigateForward(`statistics/${this.configId}`);
  }

}
