import { NgModule }                         from '@angular/core';
import { BrowserModule }                    from '@angular/platform-browser';
import { RouterModule }                     from '@angular/router';
import { HttpModule }                       from '@angular/http';

// Services, guards
import { ErrorService }                     from './error/error.service';
import { NetworkService } 									from './shared/network.service';
import { StorageService } 									from './shared/storage.service';
import { AuthGuard } 												from './nav-guards/auth-guard';

// App module components
import { AppComponent }                     from './app.component';
import { LandingPageComponent }             from './landing-page/landing-page.component';
import { NotFoundComponent }                from './not-found/not-found.component';
import { NavbarComponent }                  from './navbar/navbar.component';
import { AnnouncementsComponent }           from './announcements/announcements.component';

// Modules
import { MessageModule }                    from './message/message.module';
import { AuthModule }                       from './auth/auth.module';
import { ErrorModule }                      from './error/error.module';
import { FindFriendModule }                 from './find-friend/find-friend.module';
import { SharedModule }                     from './shared/shared.module';
import { ProfileModule }                    from './profile/profile.module';

// RouteConfigs
import { routing }     											from './app.routing';
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
    providers: [ appRoutingProviders, ErrorService, NetworkService, StorageService, AuthGuard ]
})
export class AppModule { }