import { Component, OnInit, OnDestroy }     from '@angular/core';
import { ActivatedRoute, Router, Params }   from '@angular/router';

@Component({
    selector: 'my-profile',
    template: `
                <nav>
                <div class="container">
                    <ul class="nav nav-tabs nav-justified">
                      <li ><a routerLink = "./" routerLinkActive="active">Profile</a></li>
                      <li ><a routerLink = "followers" routerLinkActive="active">Followers</a></li>
                      <li ><a routerLink = "following" routerLinkActive="active">Following</a></li>
                    </ul>
                </div>
                </nav>
                <div class="col-md-12 col-lg-12 col-sm-12 well">
                    <router-outlet></router-outlet>
                </div>
`
})
export class ProfileComponent implements OnInit, OnDestroy {
    userId;
    subscription;
    constructor(private _route: ActivatedRoute, private _router: Router) { }

    ngOnInit() {
        //getting the userId from URL param
         this._route.params
            .forEach((params: Params) =>
             this.userId = params['userId']);
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }

}