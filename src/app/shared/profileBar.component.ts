import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-profilebar',
    template: `
<ul class="nav navbar-nav navbar-right">
    <li class="dropdown">
        <a href="#" class="dropdown-toggle profile-image" data-toggle="dropdown">
            <img [src]="pictureUrl" class="img-circle profile-picture"> {{ username }} <b class="caret"></b>
        </a>
    <ul class="dropdown-menu">
        <li><a [routerLink]="['/profile', userId]" routerLinkActive="active"><i class="fa fa-cog"></i> Profile</a></li>
        <li><a routerLink = '/update-profile-form' routerLinkActive="active"><i class="fa fa-pencil"></i> Edit Profile</a></li>
                                                                                
        <li role="separator" class="divider"></li>
        <li><a routerLink="/" (click)="logout()"><i class="fa fa-sign-out"></i> Sign out</a></li>
    </ul>
    </li>
</ul>
`
})
export class ProfileBarComponent implements OnInit {
    userId = localStorage.getItem('userId');
    username = localStorage.getItem('username');
    pictureUrl = localStorage.getItem('pictureUrl');

    constructor() { }

    ngOnInit() {
    }

    logout() {
        localStorage.clear();
    }

}