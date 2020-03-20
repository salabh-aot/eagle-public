import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PageScrollService, EasingLogic } from 'ngx-page-scroll-core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { ApiService } from 'app/services/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  isSafari: boolean;
  loggedIn: string;
  hostname: string;
  showIntroModal: string;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  public defaultEasing: EasingLogic = (t: number, b: number, c: number, d: number): number => {
    // easeInOutExpo easing
    if (t === 0) {
      return b;
    }
    if (t === d) {
      return b + c;
    }
    if ((t /= d / 2) < 1) {
      return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    }

    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  }

  constructor(
    public router: Router,
    private cookieService: CookieService,
    private api: ApiService,
    private pageScrollService: PageScrollService
  ) {
    // ref: https://stackoverflow.com/questions/5899783/detect-safari-using-jquery
    this.isSafari = (/^((?!chrome|android).)*safari/i.test(navigator.userAgent));

    // used for sharing links
    this.hostname = this.api.apiPath; // TODO: Wrong
  }

  ngOnInit() {
    this.loggedIn = this.cookieService.get('loggedIn');

    this.router.events
    .takeUntil(this.ngUnsubscribe)
    .subscribe(() => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      this.pageScrollService.scroll({
        document: document,
        scrollTarget: '.theTop',
        easingLogic: this.defaultEasing,
      });
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
