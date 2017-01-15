import { NgModule }                         from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { RouterModule }                     from '@angular/router';
import { HttpModule }                       from '@angular/http';

import { ErrorService }                     from './error/error.service';

//App module components
import { AppComponent }                     from './app.component';
import { LandingPageComponent }             from './landingPage.component';
import { NotFoundComponent }                from './not-found.component';
import { NavbarComponent }                  from './navbar.component';
import { AnnouncementsComponent }           from './announcements.component';

//Additional functionality for localStorage
import { ObjectStore }                      from './objectStore';

//Modules
import { MessageModule }                    from './message/message.module';
import { AuthModule }                       from './auth/auth.module';
import { ErrorModule }                      from './error/error.module';
import { FindFriendModule }                 from './findFriend/findFriend.module';
import { SharedModule }                     from './shared/shared.module';
import { ProfileModule }                    from './profile/profile.module';

//RouteConfigs
import { routing, appRoutingProviders }     from './app.routing';
import { profileRouting }                   from './profile/profile.routing';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule,

        SharedModule,
        MessageModule,
        ProfileModule,
        AuthModule,
        ErrorModule,
        FindFriendModule,

        profileRouting,
        routing
    ],
    declarations: [
        AppComponent,
        NavbarComponent,
        LandingPageComponent,
        AnnouncementsComponent,
        NotFoundComponent
    ],
    bootstrap: [ AppComponent ],
    providers: [ appRoutingProviders, ErrorService, ObjectStore ]
})
export class AppModule { }