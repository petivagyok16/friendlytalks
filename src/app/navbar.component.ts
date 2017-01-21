import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
    selector: 'my-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent implements OnInit, DoCheck {
    userId;
    landingPage;

    constructor() { }

    ngOnInit() {

    }

    ngDoCheck() {
        this.userId = localStorage.getItem('userId');
        this.landingPage = this.isLoggedIn() ? '/announcements' : '';
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }

    logout() {
        localStorage.clear();
    }
}