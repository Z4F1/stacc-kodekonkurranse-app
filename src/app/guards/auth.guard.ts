import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators'
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private apiService: ApiService, private router: Router){}

    canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.apiService.isAuthenticated.pipe(
            filter(val => val !== null),
            take(1),
            map(isAuthenticated => {
                if(isAuthenticated){
                    return true
                }else {
                    this.router.navigateByUrl("/login")
                    return false
                }
            })
        )
    }
}
