import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { UserData } from 'src/app/services/storage/user-data';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { LoadingController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Statistics } from 'src/app/interfaces/poll/statistics/statistics';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  public configSelected: string;
  public configName: string;
  public institutionName: string;
  public googleDataStudioUrl: SafeResourceUrl;
  public statisticsList: Statistics[];
  

  constructor(
    private api: ApiService,
    private userData: UserData,
    private route: ActivatedRoute,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private domSanitizer: DomSanitizer,

    
  ) {
    this.configSelected = this.route.snapshot.paramMap.get("config");
/*     this.configName = this.route.snapshot.paramMap.get("configName");
    this.institutionName = this.route.snapshot.paramMap.get("institutionName"); */
  }

  ngOnInit() {
    this.getStatistics();
   /*  this.googleDataStudioUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://datastudio.google.com/embed/reporting/8ce9fc36-bbea-4df5-9f00-d4d34d8c5def/page/6zXD'); */
  }

  async getStatistics(){
    const token = await this.userData.getToken();
    const loading = await this.loadingCtrl.create({ message: "Cargando..." });
    await loading.present();
    this.api.getAll("statistics?configuration=" + this.configSelected, token).subscribe(
      (res) => {
        this.statisticsList = res;
        console.log(this.statisticsList);
        
        try {
          this.googleDataStudioUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.statisticsList[0].path_google);
          loading.dismiss();
          
        } catch (error) {
          this.statisticsList=null;
          loading.dismiss();
        }
        console.log(this.googleDataStudioUrl);
        
      },
      async (error) => {
        loading.dismiss();
        console.log(error);
        
      }
    );
  }

}
