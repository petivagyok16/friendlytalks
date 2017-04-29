import { Component, OnInit }    from '@angular/core';
import { Observable }           from 'rxjs/Rx';
import { FormControl }          from '@angular/forms';

import { FindFriendService }    from './findFriend.service';
import { Profile }              from '../profile/profile';
import { ErrorService }         from '../error/error.service';

@Component({
    selector: 'my-findFriend',
    templateUrl: 'findFriend.component.html'
})

export class FindFriendComponent implements OnInit {
    private foundUsers: Profile[] = [];
    private isLoading = false;
    private searchTerm = new FormControl();

    constructor(private _findFriendService: FindFriendService,
    private _errorService: ErrorService) { }

    ngOnInit() {

        // event raised from each input field keyups, returns a searchTerm after filtering
        const keyups = this.searchTerm.valueChanges

            // picking only the value from the event object
            // .map(e => e.target.value)
            // waiting 400ms until subscribe fires the async call
            .debounceTime(400)
            // no async call until the search term is the same (e.g. arrow keys would fire the subscribe method as well)
            .distinctUntilChanged()
            .filter(text => {
                // if text is undefined (= user removed all the characters from the input field)
                // foundUsers array will be empty and gives back no feedback
                if (text.length === 0) {
                    this.foundUsers = [];
                } else {
                    // firing subscribe only if there are at least 3 characters
                    return text.length >= 2;
                }

            })
            .map(searchTerm => {
                return searchTerm;
            });

        // subscribing to the keyup events and firing findFriendService in order to get back the found users list
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
