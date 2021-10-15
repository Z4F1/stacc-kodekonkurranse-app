import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { filter, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

    constructor(private apiService: ApiService, private router: Router){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.apiService.isAuthenticated.pipe(
            filter(val => val !== null),
            take(1),
            map(isAuthenticated => {
                if(isAuthenticated){
                    this.router.navigateByUrl("/")
                    return false
                }else {
                    return true
                }
            })
        )
    }
  
}
