import { Component, OnInit }    from '@angular/core';
import { Observable }           from 'rxjs/Rx';
import { FormControl }          from '@angular/forms';

import { FindFriendService }    from './findFriend.service';
import { Profile }              from '../profile/profile';
import { ErrorService }         from '../error/error.service';

@Component({
    selector: 'my-findFriend',
    template: `
<div class="container">
    <div class="col-md-6 col-md-offset-3 margin-bottom" id="inputContainer">
      <div class="input-group">
        <span class="input-group-addon" id="searchAddon"><i class="glyphicon glyphicon-search"></i></span>
        <input [formControl]="searchTerm" type="text" class="form-control" aria-describedby="searchAddon">
      </div>
      <div class="col-md-12 center-align"><spinner [visible]="isLoading"></spinner></div>
    </div>
    <div class="col-md-6 col-md-offset-3 well" *ngIf="foundUsers === null">No user found!</div>
    <div class="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-6 col-xs-offset-3 message-panel"  *ngFor="let user of foundUsers">
    <div class="media">
        <div class="media-left">
            <a [routerLink]="['/profile', user.id]">
              <img class="media-object" [src]="user.pictureUrl" alt="...">
            </a>
        </div>
    <div class="media-body">
        <h4 class="media-heading"><a [routerLink]="['/profile', user.id]">@{{ user.username }}</a></h4>
        <div class="well well-sm white-bg well-margin-bottom">{{ user.name.first }}, {{ user.name.last }}</div>
        <div class="well well-sm white-bg well-margin-bottom">{{ user.email }}</div>
    </div>
    </div>
    </div>
</div>
`
})

export class FindFriendComponent implements OnInit {
    foundUsers: Profile[] = [];
    isLoading = false;
    searchTerm = new FormControl();

    constructor(private _findFriendService: FindFriendService,
    private _errorService: ErrorService) { }

    ngOnInit() {

        //event raised from each input field keyups, returns a searchTerm after filtering
        var keyups = this.searchTerm.valueChanges

            //picking only the value from the event object
            //.map(e => e.target.value)
            .filter(text => {

                //if text is undefined (= user removed all the characters from the input field) foundUsers array will be empty and gives back no feedback
                if (!text) {
                    this.foundUsers = [];
                } else {
                    //firing subscribe only if there are at least 3 characters
                    return text.length >= 2;
                }

            })
            //waiting 400ms until subscribe fires the async call
            .debounceTime(400)
            //no async call until the search term is the same (e.g. arrow keys would fire the subscribe method as well)
            .distinctUntilChanged()
            .map(searchTerm => {
                return searchTerm;
            });

        //subscribing to the keyup events and firing findFriendService in order to get back the found users list
        keyups.subscribe(
            searchTerm => {
                this.isLoading = true;
                this._findFriendService.find(searchTerm)
                    .subscribe(
                        foundUsers => {

                            // null value gives feedback to user that 'no user found'
                            if (foundUsers.length === 0) {
                                this.foundUsers = null;
                            } else {
                                this.foundUsers = foundUsers;
                            }

                        },
                        error => this._errorService.handleError(error),
                        () => this.isLoading = false);
            },
            error => console.log(error));
    }

}