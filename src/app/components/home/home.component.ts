import { Component } from '@angular/core';
import { Service } from './../../services/service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'session recovery POC app';
  userName = null;

  constructor(private svc: Service) {

  }

  // Login(e) {
  //   this.svc.Login('prem', 'pass')
  //     .subscribe(res => {
  //       this.userName = res.display_name;
  //     })
  // }

  // Logout(e) {
  //   this.svc.Logout();
  // }
}
