import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-announcements',
  template: `<h1>Announcements</h1>
  <!-- <div class="col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-6 col-xs-offset-3 message-panel">
      <div class="media">
    <div class="media-left">
      <a href="#">
        <img class="media-object" src="https://unsplash.it/100/100" alt="...">
      </a>
    </div>
    <div class="media-body">
      <h4 class="media-heading">@Username</h4>
      <div class="col-md-10 col-sm-10 col-xs-10 message-content">Some mes sage Some message  Sssage  Some message Some  Sssage  Some </div>
      <div class="col-md-2 col-sm-2 col-xs-2 pull-right right-align message-config">
        <div class="message-config">
          <i class="glyphicon glyphicon-pencil cursor-pointer left-align" data-toggle="tooltip" title="Edit" (click)="onEdit(messageItem)"> </i> 
          <i class="glyphicon glyphicon-remove glyphicon-remove-color cursor-pointer left-align" data-toggle="tooltip" title="Remove" (click)="onDelete(messageItem)"> </i>
        </div>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 message-footer">
        <div class="col-md-6 col-sm-6 col-xs-6 left-align"> panel ratings </div>
        <div class="col-md-6 col-sm-6 col-xs-6 right-align"> panel date</div> 
      </div>
  </div>
  </div>
  </div> -->
`
})
export class AnnouncementsComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

}
