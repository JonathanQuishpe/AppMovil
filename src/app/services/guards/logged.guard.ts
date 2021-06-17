import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user/user';
import { UserData } from '../storage/user-data';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(
    private userData: UserData,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userData.getUser().then((res) => {
      const user: User = res;
      if (user) {
        if (user.role.name === 'Establecimiento') {
          this.router.navigate(['/tabs/home-establecimiento'], { replaceUrl: true });
          return false;
        }else{
          this.router.navigate(['/tabs/home'], { replaceUrl: true });
          return false;
        }
      }
      return true;
    });
  }
}
