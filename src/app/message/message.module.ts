
import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule }                     from '@angular/router';

import { MessageComponent }                 from './message.component';
import { MessageService }                   from './message.service';
import { ProfileService }                   from '../profile/profile.service';
import { SharedModule }                     from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        MessageComponent
    ],
    exports: [
        MessageComponent
    ],
    providers: [
        MessageService,
        ProfileService
    ]
})
export class MessageModule {}
