import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserData } from '../storage/user-data';

@Injectable({
  providedIn: 'root'
})
export class AuthChildrenGuard implements CanActivateChild {

  constructor(
    private userData: UserData,
    private platform: Platform,
    private router: Router
  ) {}


  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.userData.getUser().then((res) => {
        const user = res;
        if(!user){
          this.router.navigate(["/login"], { replaceUrl: true });
          return false;
        }
        return true;
      });

  }
  
}
