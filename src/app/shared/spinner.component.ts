import { Component, Input } from '@angular/core';

@Component({
    selector: 'spinner',
    template: `<div class="col-md-12 centerAlign"><i *ngIf="visible" class="fa fa-spinner fa-pulse fa-fw fa-3x"></i></div>`
})

export class SpinnerComponent {

@Input() visible = true;

}