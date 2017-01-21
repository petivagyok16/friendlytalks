import { Component, OnInit, OnChanges, Input }  from '@angular/core';

import { Ratings }                              from './profile';

@Component({
    selector: 'my-ratio',
    template: `
<label for="ownRatings">My Ratings ratio</label>
    <div class="well well-sm well-rating" id="ownRatings">
        <div class="progress">
          <div *ngIf="myLikes != 0" class="progress-bar progress-bar-success progress-bar-striped active" [style.width]="myLikes + '%'">
           <i class="glyphicon glyphicon-thumbs-up"></i>  {{ myLikes}} %
          </div>
          <div *ngIf="myDislikes != 0" class="progress-bar progress-bar-danger progress-bar-striped active" [style.width]="myDislikes + '%'">
           <!-- 💩 --> <i class="fa fa-thumbs-down"></i> {{ myDislikes }} %
          </div>
          
        </div>
    </div>

<label for="givenRatings">Given Ratings ratio</label>
    <div class="well well-sm" id="givenRatings"> 
        <div class="progress">
          <div *ngIf="givenLikes != 0" class="progress-bar progress-bar-success progress-bar-striped active" [style.width]="givenLikes + '%'">
            <i class="glyphicon glyphicon-thumbs-up"></i> {{ givenLikes }} %
          </div>
          <div *ngIf="givenDislikes != 0" class="progress-bar progress-bar-danger progress-bar-striped active" [style.width]="givenDislikes + '%'">
          <!-- 💩 --> <i class="fa fa-thumbs-down"></i> {{ givenDislikes }} %
          </div>
    </div>
</div>`
})

export class ProfileStatsComponent implements OnInit, OnChanges {
    @Input() ratings = new Ratings();

    myLikes: number = 0;
    myDislikes: number = 0;
    givenLikes: number = 0;
    givenDislikes: number = 0;

    constructor() { }

    ngOnInit() {

    }

    // ngOnChanges is vital of this component's life, because selectedUser.ratings object arrives a little bit later and
    // the changes need to be tracked later as well.
    ngOnChanges() {
        // console.log(this.ratings);
        this.ratioCalc(this.ratings);
    }

    ratioCalc(ratingObj) {
        // My rating ratio
        const myTotal = ratingObj.my.likes.length + ratingObj.my.dislikes.length;
        this.myLikes = Number((ratingObj.my.likes.length / (myTotal / 100)).toFixed(1));
        this.myDislikes = Number((ratingObj.my.dislikes.length / (myTotal / 100)).toFixed(1));

        // Given ratings ratio
        const givenTotal = ratingObj.given.likes.length + ratingObj.given.dislikes.length;
        this.givenDislikes = Number((ratingObj.given.dislikes.length / (givenTotal / 100)).toFixed(1));
        this.givenLikes = Number((ratingObj.given.likes.length / (givenTotal / 100)).toFixed(1));

    }

}