import { Component, OnInit } from '@angular/core';
import { Service } from './../../services/service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {
  submitted = false;
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;


  constructor(private svc: Service, public fb: FormBuilder, private router: Router) {
    this.createFormControls();
    this.createForm();
  }

  ngOnInit() {
    if(this.svc.IsAuthenticated()){
      this.router.navigate(['member']);
    }
  }

  createFormControls() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
    ]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]);

  }

  createForm() {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  onSubmit({ value, valid }) {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.svc.Login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(res => {
          console.log(res);
         this.router.navigate(['member']);
        }, err => {
          console.log(err);
        })
      //this.loginForm.reset();
    }
  }

  fillRightCredential() {
    this.loginForm.setValue({
      email: 'user@email.com',
      password: 'password',
    });

  }

  fillWrongCredential() {
    this.loginForm.setValue({
      email: 'wrong@email.com',
      password: 'password123',
    });
  }

  Logout(e) {
    this.svc.Logout();
  }
}
