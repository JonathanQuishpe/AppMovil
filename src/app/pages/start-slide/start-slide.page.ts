import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/services/storage/user-data';

@Component({
  selector: 'app-start-slide',
  templateUrl: './start-slide.page.html',
  styleUrls: ['./start-slide.page.scss'],
})
export class StartSlidePage implements OnInit {

  public showed: string;

  constructor(
    private router: Router,
    private userData: UserData,
  ) { }

  ngOnInit() {
  }

  continue(){
    this.showed = "true";
    console.log("continuo!!!");
    this.router.navigate(['/login'], { replaceUrl: true });
    this.userData.setShowSlides(this.showed);
  }

}
