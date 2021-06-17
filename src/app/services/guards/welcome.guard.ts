import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserData } from '../storage/user-data';

@Injectable({
  providedIn: 'root',
})
export class WelcomeGuard implements CanActivate {
  constructor(
    private userData: UserData,
    private platform: Platform,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.userData.getShowSlides().then((res) => {
      if (this.platform.is('android') || this.platform.is('ios')) {
        if (res === 'true') {
          this.router.navigate(['/login'], { replaceUrl: true });
          return false;
        }
      } else {
        this.router.navigate(['/login'], { replaceUrl: true });
        return false;
      }
      return true;
    });
  }
}
