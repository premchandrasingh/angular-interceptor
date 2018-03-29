import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Service } from './service';

@Injectable()
export class AuthMemberGuardService implements CanActivate {

  constructor(private svc: Service, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.svc.IsAuthenticated()) {
      return true;
    }
    this.router.navigate(['login'], { queryParams: { returnUrl: 'member/list' } })
    return false;
  }
}


