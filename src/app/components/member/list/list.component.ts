import { Component, OnInit } from '@angular/core';
import { Service } from '../../..//services/service';
import 'rxjs/add/operator/do';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  remainingLife: number;
  constructor(private svc: Service) {
    this.makeAPICallBeforeTokenExpire();
    this.makeAPICallAfterTokenExpire();
  }

  ngOnInit() {

  }

  makeAPICallBeforeTokenExpire() {
    var obs1 = this.makeSampleCall1();
    var obs2 = this.makeSampleCall2();
    //https://www.bennadel.com/blog/3192-performing-the-stream-equivalent-of-promise-all-using-rxjs.htm
   forkJoin([obs1, obs2])
      .subscribe(() => {
        console.log('Both call successful BEFORE token refreshed...');
      })
  }

  makeAPICallAfterTokenExpire() {
    this.remainingLife = this.svc.getTokenRemainingLife();

    var ref = setInterval(() => {
      if (this.remainingLife <= 0) {
        clearInterval(ref);

        var obs1 = this.makeSampleCall1();
        var obs2 = this.makeSampleCall2();

        forkJoin([obs1, obs2])
          .subscribe(() => {
            console.log('Both call successful AFTER token refreshed');
            //this.makeAPICallAfterTokenExpire();
          })
        return;
      }

      this.remainingLife--;
    }, 1000)
  }

  makeSampleCall1() {
    var obs = this.svc.SampleCall();
    return obs.do(data => {
      console.log('SampleCall 1 successful ', data);

    }, err => {
      console.log('SampleCall 1 failed ', err)
    });
  }

  makeSampleCall2() {
    var obs = this.svc.SampleCall2();
    return obs.do(data => {
      console.log('SampleCall 2 successful ', data);
    }, err => {
      console.log('SampleCall 2 failed ', err)
    });
  }



}
