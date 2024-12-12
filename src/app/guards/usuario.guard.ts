import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PeticionesHttpService } from '../services/peticiones-http.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard {
 
 constructor(private _peticionesHttp:PeticionesHttpService,
            private router:Router){ } 

  canActivate:CanActivateFn=( route:ActivatedRouteSnapshot,state:RouterStateSnapshot ):boolean |UrlTree=>{
    if(this._peticionesHttp.isAuthenticated())
      return true;
    else
      return this.router.parseUrl('login');
      //return false;
  }
}
