import { Injectable }               from '@angular/core';
import { Http, Headers, Response }  from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import { Observable }               from 'rxjs';

import { Profile, UpdatedProfile }  from './profile';
import { Message }                  from '../message/message';

@Injectable()
export class ProfileService {
    private _url: string = 'https://friendlytalks.herokuapp.com/profile';
    private _token = localStorage.getItem('token') ? '?token=' + localStorage.getItem('token') : '';

    constructor(private _http: Http) {}

    // Finding the requested user profiles
    find(userId) {
        return this._http.get(this._url + '/' + userId + this._token)
            .map((response: Response) => {
                const DATA = response.json().obj;

                    let profile = new Profile(DATA.username, DATA._id, DATA.messages, DATA.email, DATA.pictureUrl, DATA.city);
                    profile.name = DATA.name;
                    profile.relations = DATA.relations;
                    profile.ratings = DATA.ratings;

                return profile;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    // by sending the followed and follower user's IDs i can set it server-side to
    // change both user's relation states in one http request
    follow(userId, toFollowId, state) {
        // console.log('userId: ' + userId, 'toFollowId: ' + toFollowId, 'following state: ' + state);
        const toFollowOrUnfollow = JSON.stringify({ toFollowId: toFollowId, state: state});
        const HEADERS = new Headers({'Content-Type' : 'application/json'});

        return this._http.patch(this._url + '/' + userId + this._token, toFollowOrUnfollow, {headers: HEADERS})
            .map((response: Response) => console.log(response.json()))
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getFollowers(userId) {

        return this._http.get(this._url + '/followers' + '/' + userId + this._token)
            .map((response: Response) => {
                const DATA = response.json().obj;
                const objs: any[] = [];

                for (let i = 0; i < DATA.length; i++) {
                    const follower = new Profile(DATA[i].username, DATA[i]._id, null, DATA[i].email, DATA[i].pictureUrl);
                    follower.name = DATA[i].name;
                    objs.push(follower);
                }
                return objs;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getFollowing(userId) {

        return this._http.get(this._url + '/following' + '/' + userId + this._token)
            .map((response: Response) => {
                const DATA = response.json().obj;
                const objs: any[] = [];

                 for(let i = 0; i < DATA.length; i++) {
                 const following = new Profile(DATA[i].username, DATA[i]._id, [], DATA[i].email, DATA[i].pictureUrl);
                     following.name = DATA[i].name;

                     objs.push(following);
                 }
                 return objs;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getFollowingMessages(userId) {
        return this._http.get(this._url + '/followingmessages' + '/' + userId + this._token)
            .map((response: Response) => {
                const DATA = response.json().obj;

                const objs: any[] = [];
                for (let i = 0; i < DATA.length; i++) {

                    for (let j = 0; j < DATA[i].messages.length; j++) {
                        let message = new Message(DATA[i].messages[j].content, DATA[i].messages[j].created_at,
                        DATA[i].username, DATA[i].messages[j].meta, DATA[i].messages[j]._id, DATA[i].messages[j].user, DATA[i].pictureUrl);
                        objs.push(message);
                    }
                }
                return objs;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    editProfile(userId, profile: UpdatedProfile) {
        const BODY = JSON.stringify(profile);
        const HEADERS = new Headers({'Content-Type' : 'application/json'});

        return this._http.patch(this._url + '/editprofile' + '/' + userId + this._token, BODY, {headers: HEADERS})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

}