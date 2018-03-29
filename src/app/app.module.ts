import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';



import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SessionRecoveryInterceptor } from './interceptors/session-recovery.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { Service } from './services/service';
import { AuthMemberGuardService } from './services/auth-member-guard.service';

import { RouterConfig } from './app.routers';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ListComponent } from './components/member/list/list.component';
import { AddComponent } from './components/member/add/add.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ListComponent,
    AddComponent
  ],
  imports: [
    RouterConfig,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionRecoveryInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    },
    Service,
    AuthMemberGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
