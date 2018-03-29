import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from './services/service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLogin: boolean = false;
  constructor(private svc: Service, private router:Router) {
    this.updateLoginState();
  }

  updateLoginState() {
    this.isLogin = this.svc.IsAuthenticated();
    this.svc.getBridge().subscribe(data => {
      if (data.type == 'LOGGED_IN') {
        this.isLogin = true;
      } else if (data.type == 'LOGGED_OUT') {
        this.isLogin = false;
      }
    })
  }

  Logout_Click(){
    this.svc.Logout()
    .subscribe(data=>{
      this.router.navigate(['login']);
    })

  }
}
